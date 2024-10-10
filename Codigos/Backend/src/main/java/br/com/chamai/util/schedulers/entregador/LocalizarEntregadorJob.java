package br.com.chamai.util.schedulers.entregador;

import java.net.URISyntaxException;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.context.ApplicationContext;

import com.google.gson.Gson;

import br.com.chamai.configs.ApplicationContextHolder;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.EntregaEndereco;
import br.com.chamai.models.EntregaStatus;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pagamento;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.enums.StatusEntrega;
import br.com.chamai.repositories.AgendamentoRepository;
import br.com.chamai.repositories.EntregaRepository;
import br.com.chamai.repositories.LocalizacaoRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.repositories.VeiculoRepository;
import br.com.chamai.services.EntregaEnderecoService;
import br.com.chamai.services.EntregaService;
import br.com.chamai.services.EntregaStatusService;
import br.com.chamai.services.LocalizacaoService;
import br.com.chamai.services.PagamentoService;
import br.com.chamai.util.UtilMethods;
import br.com.chamai.util.socket.SocketClient;
import br.com.chamai.util.socket.SocketRequest;
import br.com.chamai.util.socket.SocketRequestMessage;
import br.com.chamai.util.socket.enums.SocketAssunto;

/**
 * Classe responsável por buscar entregador para cada entrega
 * 
 * Após migrar os dados deve-se localizar o entregador que fará a entrega A
 * lista AGENDAMENTOS deve ser iterada e o ID da entrega localizado pelo método
 * getIdEntrega
 */
public class LocalizarEntregadorJob implements Job {
	
	private final int ADDITIONAL_TIME = 10; 
	private final int LIMIT_QUANTITY = 5; 
	
	ApplicationContext instance = ApplicationContextHolder.getInstance();
	EntregaService entregaService = instance.getBean(EntregaService.class);
	EntregaRepository entregaRepository = instance.getBean(EntregaRepository.class);
	EntregaEnderecoService entregaEnderecoService = instance.getBean(EntregaEnderecoService.class);
	PagamentoService pagamentoService = instance.getBean(PagamentoService.class);
	LocalizacaoService localizacaoService = instance.getBean(LocalizacaoService.class);
	EntregaStatusService entregaStatusService = instance.getBean(EntregaStatusService.class);
	AgendamentoRepository agendamentoRepository = instance.getBean(AgendamentoRepository.class);
	VeiculoRepository veiculoRepository = instance.getBean(VeiculoRepository.class);
	LocalizacaoRepository localizacaoRepository = instance.getBean(LocalizacaoRepository.class);
	UsuarioRepository usuarioRepository = instance.getBean(UsuarioRepository.class);

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		Calendar calendar = Calendar.getInstance();
		
		calendar.add(Calendar.MINUTE, ADDITIONAL_TIME);
		calendar.set(Calendar.SECOND, 0);
		
		LocalDate dataAtual = new java.sql.Date(calendar.getTime().getTime()).toLocalDate();
		Time time = Time.valueOf(LocalTime.of(calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), 0));
		System.out.printf("Localizar entregador para entrega em =>  %s - %s", dataAtual, time);
		System.out.println("");
		
		entregaRepository.findMigration(dataAtual, time)
		.stream()
		.forEach((Entrega entrega) -> {
			try {
				localizarEntregador(entrega);
			} catch (Exception e) {
				desfazerProcesso(entrega);
			}
		});
	}
	
	private void localizarEntregador(Entrega entrega) {
		if (entrega.getEntregador() != null) {
			throw new ExcecaoTempoExecucao("Já existe entregador para este agendamento");
		}
		
		List<EntregaEndereco> enderecos = entregaEnderecoService.listByEntrega(entrega);
		if (enderecos == null) {
			new EntidadeNaoEncontrada("Não existem endereços cadastrados para o agendamento com o id " + entrega.getAgendamento().getId());
		}
		
		EntregaEndereco entregaOrigem = entregaService.getEnderecoOrigem(enderecos);
		
		EntregaEndereco entregaDestino = entregaService.getEnderecoDestino(enderecos);
		
		Pagamento pagamento = pagamentoService.findByEntrega(entrega)
				.orElseThrow(() -> new EntidadeNaoEncontrada("Não existem pagamento cadastrado para o agendamento com o id " + entrega.getAgendamento().getId()));
		
		List<Localizacao> listLocalizacoes = localizacaoService.listEntregadoresByLatitudeLongitude(entregaOrigem.getLatitude(), entregaOrigem.getLongitude(), entrega.getTipoVeiculo());
		if (listLocalizacoes == null || listLocalizacoes.isEmpty()) {
			if (entrega.getPreferencia() == null) {
				throw new EntidadeNaoEncontrada("Não existe entregadores disponíveis no momento");
			} else {
				localizacaoService.localizacaoEntregadorDisponivel(entrega.getPreferencia().getId())
					.orElseThrow(() -> new EntidadeNaoEncontrada("Entregador preferencial com id " + entrega.getPreferencia().getId() + " está indisponível no momento"));
			}
		} else {
			if (entrega.getPreferencia() != null) {
				localizacaoService.localizacaoEntregadorDisponivel(entrega.getPreferencia().getId())
					.ifPresent(obj -> {
						listLocalizacoes.add(0, obj);
						if (listLocalizacoes.size() > LIMIT_QUANTITY) {
							listLocalizacoes.remove(listLocalizacoes.size() - 1);
						}
					});
			}
		}
		
		Pessoa entregador = entregaService.getEntregadorFromListLocalizacoes(entrega, listLocalizacoes, entregaOrigem, entregaDestino, pagamento);
		
		setaIndisponivelParaLocalizacaoEntregador(entregador.getId());
		registrarEntregador(entrega, entregador);
		entregaService.registraStatusEntrega(entrega, StatusEntrega.EDR);
		notificarCliente(entrega);
	}
  
	private void notificarCliente(Entrega entrega) {
		if (entrega.getAgendamento() == null || entrega.getAgendamento().getId() == null) {
			return;
		}
		try (SocketClient socketClient = SocketClient.getConectionClient()) {
			socketClient.setConnectionLostTimeout(45);
			socketClient.connectBlocking();
			long idUsuario = getIdUsuarioByCliente(entrega.getCliente());
			
			SocketRequestMessage message = SocketRequestMessage.builder()
					.assunto(SocketAssunto.DELIVERY_START)
					.sender(UtilMethods.toLong(SocketClient.WEBSOCKET_ADMIN_ID))
					.receiver(idUsuario)
					.idEntrega(entrega.getId())
					.idAgendamento(entrega.getAgendamento().getId())
				.build();
			
			SocketRequest request = SocketRequest.builder()
					.receiver(idUsuario)
					.message(message)
				.build();
			
			socketClient.send(new Gson().toJson(request));
		} catch (URISyntaxException ex) {
			ex.printStackTrace();
		} catch (InterruptedException ex) {
			ex.printStackTrace();
		}
  	}
  
	public long getIdUsuarioByEntregador(Pessoa entregador) {
		return usuarioRepository.getIdUsuarioByEntregadorId(entregador.getId()).orElse(0l);
	}
	
	public long getIdUsuarioByCliente(Pessoa entregador) {
		return usuarioRepository.getIdUsuarioByClienteId(entregador.getId()).orElse(0l);
	}
  
  	private void setaIndisponivelParaLocalizacaoEntregador(Long idPessoa) {
		Optional<Localizacao> optional = localizacaoRepository.findByEntregador(idPessoa);
		if (optional.isPresent()) {
			Localizacao localizacao = Localizacao.builder()
					.id(optional.get().getId())
					.pessoa(optional.get().getPessoa())
					.data(LocalDate.now())
					.hora(new Time(System.currentTimeMillis()))
					.latitude(optional.get().getLatitude())
					.longitude(optional.get().getLongitude())
					.disponivel(false)
					.build();
			localizacaoRepository.save(localizacao);
		}
	}

	private void registrarEntregador(Entrega entrega, Pessoa entregador) {
		// registrar entregador na entrega
		entregaRepository.updateEntregadorById(entrega.getId(), entregador);

		// registrar entregador no agendamento
		agendamentoRepository.updateEntregadorById(entrega.getAgendamento().getId(), entregador);
	}
  
	private void desfazerProcesso(Entrega entrega) {
		// faz verificação se existirá uma próxima tentativa em localizar entregador para entrega atual antes de desfazer o processo
		if (!isFindMigration(entrega)) {
			return;
		}

		// faz verificação se já foi informado o entregador
		if (isEntregadorInformado(entrega.getEntregador())) {
			System.out.println("Entrgador já informado");
			return;
		}

		agendamentoRepository.updateRealizadoById(entrega.getAgendamento().getId(), false); // volta status de realizado para false do agendamento da entrega ok

		EntregaStatus entity = EntregaStatus.builder()
					.entrega(entrega)
					.status(StatusEntrega.ENE)
				.build();
		entregaStatusService.insert(entity); // registrar status de entregador não localizado (ENE)

		// estornar pagamento (vlr do app, vlr. entregador, vlr do parceiro (produto) - movimento   ) - cp, cr (exclusão) - (estorno)
	}
  
	private boolean isEntregadorInformado(Pessoa entregador) {
		if (entregador == null || UtilMethods.toLong(entregador.getId()) <= 0) {
			return false;
		}
		return entregaRepository.isEntregador(UtilMethods.toLong(entregador.getId())).orElse(false);
	}
  
	private boolean isFindMigration(Entrega entrega) {
		Calendar calendar = Calendar.getInstance();

		calendar.set(Calendar.SECOND, 0);
		calendar.add(Calendar.MINUTE, ADDITIONAL_TIME + 1);

		Time proximoTime = Time.valueOf(LocalTime.of(calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), 0));

		return proximoTime.after(entrega.getHoraExecucao());
	}

	private static boolean longValueEquals(Long value1, Long value2) {
		return Objects.equals(value1, value2);
	}

}
