package br.com.chamai.services;

import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.sql.Time;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import br.com.chamai.models.*;
import br.com.chamai.models.enums.*;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.google.gson.Gson;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.dto.CalculoEntregaDto;
import br.com.chamai.models.dto.EntregaDto;
import br.com.chamai.models.dto.EntregaEnderecoDto;
import br.com.chamai.models.dto.EntregaEnderecoLinkCalculoEntregaDto;
import br.com.chamai.models.dto.EntregadorDto;
import br.com.chamai.repositories.EntregaRepository;
import br.com.chamai.repositories.TabelaPrecoItemRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.repositories.VeiculoRepository;
import br.com.chamai.util.UtilMethods;
import br.com.chamai.util.maps.directions.DirectionsApi;
import br.com.chamai.util.maps.directions.DirectionsApiParams;
import br.com.chamai.util.maps.directions.Leg;
import br.com.chamai.util.maps.geocode.Location;
import br.com.chamai.util.socket.SocketClient;
import br.com.chamai.util.socket.SocketRequest;
import br.com.chamai.util.socket.SocketRequestMessage;
import br.com.chamai.util.socket.enums.SocketAssunto;

@Service
public class EntregaService {
	
	@Autowired private EntregaRepository repository;
	@Autowired private EntregaStatusService entregaStatusService;
	@Autowired private GoogleMapsService googleMapsService;
	@Autowired private EntregaEnderecoService entregaEnderecoService;
	@Autowired private PessoaService pessoaService;
	@Autowired private MunicipioService municipioService;
	@Autowired private AgendamentoService agendamentoService;
	@Autowired private TabelaPrecoService tabelaPrecoService;
	@Autowired private PagamentoService pagamentoService;
	@Autowired private PagamentoStatusService pagamentoStatusService;
	@Autowired private LocalizacaoService localizacaoService;
	@Autowired private TabelaPrecoItemRepository tabelaPrecoItemRepository;
	@Autowired private VeiculoRepository veiculoRepository;
	@Autowired private UsuarioRepository usuarioRepository;
	
	public List<Entrega> findAll() {
		return repository.findAll();
	}
	
	public Entrega find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de entrega com o id " + id)
		);
	}

	public List<Entrega> getEntregasByPessoa(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		return repository.getEntregasByPessoa(pessoa);
	}

	public List<Entrega> getEntregasByEntregador(Long idEntregador) {
		Pessoa pessoa = pessoaService.find(idEntregador);
		return repository.getEntregasByEntregador(pessoa);
	}

	public EntregadorDto getEntregador(Long idEntrega) throws MPException {
		Entrega entrega = find(idEntrega);
		
		if (entrega.getEntregador() != null) {
			throw new ExcecaoTempoExecucao("Já existe entregador para esta entrega");
		}
		
		List<EntregaEndereco> enderecos = entregaEnderecoService.listByEntrega(entrega);
		if (enderecos == null) {
			new EntidadeNaoEncontrada(
					"Não existem endereços cadastrados para a entrega com o id " + idEntrega
			);
		}
		
		EntregaEndereco entregaOrigem = getEnderecoOrigem(enderecos);
		EntregaEndereco entregaDestino = getEnderecoDestino(enderecos);
		Pagamento pagamento = pagamentoService
				.findByEntrega(entrega)
				.orElseThrow(() -> new EntidadeNaoEncontrada(
						"Não existe pagamento cadastrado para a entrega com o id " + idEntrega)
				);
		
		List<Localizacao> listLocalizacoes = localizacaoService.listEntregadoresByLatitudeLongitude(
				entregaOrigem.getLatitude(), entregaOrigem.getLongitude(), entrega.getTipoVeiculo()
		);

		if (listLocalizacoes == null || listLocalizacoes.isEmpty()) {
			throw new EntidadeNaoEncontrada("Não existe entregadores disponíveis no momento");
		}
		
		Pessoa entregador = getEntregadorFromListLocalizacoes(
				entrega, listLocalizacoes, entregaOrigem, entregaDestino, pagamento
		);
		
		Veiculo optionalVeiculo = veiculoRepository
				.findByPessoaAndAtivo(entregador, true)
				.orElseThrow(() -> new EntidadeNaoEncontrada(
						"Entregador selecionado não possui veículo ativo cadastrado")
				);

		entrega.setEntregador(entregador);
		update(entrega, entrega.getId());
		setaEntregadorIndisponivel(entregador);
		registraStatusEntrega(entrega, StatusEntrega.EDR);
		registraStatusPagamento(entrega, StatusPagamento.E);
		
		return getEntregadorFromVeiculo(optionalVeiculo, entregador);
	}

	public void setaEntregadorIndisponivel(Pessoa entregador) {
		localizacaoService.updateDisponivel(entregador.getId(), false);
	}

	public EntregaEndereco getEnderecoDestino(List<EntregaEndereco> enderecos) {
		return enderecos
							.stream()
							.sorted(Comparator.comparing(EntregaEndereco::getId, Comparator.reverseOrder()))
							.filter(obj -> Objects.equals(obj.getTipoEndereco(), TipoEndereco.D))
							.findFirst()
							.orElseThrow(() -> new ExcecaoTempoExecucao("Não existe endereço de destino"));
	}

	public EntregaEndereco getEnderecoOrigem(List<EntregaEndereco> enderecos) {
		return enderecos
							.stream()
							.filter(obj -> Objects.equals(obj.getTipoEndereco(), TipoEndereco.O))
							.findFirst()
							.orElseThrow(() -> new ExcecaoTempoExecucao("Não existe endereço de origem"));
	}
  
	public long getIdUsuarioByEntregador(Pessoa entregador) {
		return usuarioRepository.getIdUsuarioByEntregadorId(entregador.getId()).orElse(0l);
	}
	
	public long getIdUsuarioByCliente(Pessoa cliente) {
		return usuarioRepository.getIdUsuarioByClienteId(cliente.getId()).orElse(0l);
	}

	public Pessoa getEntregadorFromListLocalizacoes(
			Entrega entrega,
			List<Localizacao> listLocalizacoes,
			EntregaEndereco origem,
			EntregaEndereco destino,
			Pagamento pagamento
	) {
		try (SocketClient socketClient = SocketClient.getConectionClient()) {
			socketClient.setConnectionLostTimeout(45);
			socketClient.connectBlocking();
			return listLocalizacoes
					.stream()
					.filter((Localizacao obj) -> {
						long idUsuario = getIdUsuarioByEntregador(obj.getPessoa());
						SocketRequestMessage message = SocketRequestMessage.builder()
								.assunto(SocketAssunto.NOTIFICATION)
								.sender(UtilMethods.toLong(SocketClient.WEBSOCKET_ADMIN_ID))
								.receiver(idUsuario)
								.idEntrega(entrega.getId())
								.retirada(formatarEndereco(origem))
								.entrega(formatarEndereco(destino))
								.solicitante(entrega.getCliente().getNome())
								.vlrEntrega(pagamento.getTotal())
								.distancia(entrega.getDistancia())
								.tipoPagamento(pagamento.getTipoPgto().name())
							.build();
						
						SocketRequest request = SocketRequest.builder()
								.receiver(idUsuario)
								.message(message)
							.build();
						
						socketClient.responseMessage = null;
						socketClient.send(new Gson().toJson(request));
						
						for (int i = 0; i <= 35; i++) {
							try {
								sleep(1000);
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
							if (socketClient.responseMessage != null) {
								if (longValueEquals(message.getIdEntrega(), socketClient.responseMessage.getIdEntrega())
										&& longValueEquals(message.getSender(), socketClient.responseMessage.getReceiver())) {
									return socketClient.responseMessage.isResposta();
								}
							}
						}
						
						return false;
					})
					.findFirst()
					.orElseThrow(() -> new EntidadeNaoEncontrada(
							"Nenhum entregador disponível no momento"
					)).getPessoa();
		} catch (URISyntaxException ex) {
			ex.printStackTrace();
		} catch (InterruptedException ex) {
			ex.printStackTrace();
		}
		
		return null;
	}

	private void sleep(long time) throws InterruptedException {
		new Thread();
		Thread.sleep(time);
	}

	private static boolean longValueEquals(Long value1, Long value2) {
		return Objects.equals(value1, value2);
	}

	public static String formatarEndereco(EntregaEndereco obj) {
		return UtilMethods.tratarEnderecoParaGoogleMaps(
				obj.getLogradouro(), obj.getNumero(), obj.getBairro(),
				obj.getMunicipio().getNome(), obj.getMunicipio().getEstado().getSigla()
		);
	}

	@Transactional
	public Entrega insert(EntregaDto entity) {
		/*
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		*/
		Entrega entrega = new Entrega();
		BeanUtils.copyProperties(entity, entrega, "id");

		// valida cliente
		Pessoa cliente = pessoaService.find(entity.getCliente());
		if (!cliente.getCliente()) {
			throw new ExcecaoTempoExecucao("Pessoa informada não é cliente.");
		}
		entrega.setCliente(cliente);
		
		// se informado, valida entregador
		Pessoa entregador = new Pessoa();
		if (entity.getEntregador() != null) {
			entregador = pessoaService.find(entity.getEntregador());
			entrega.setEntregador(entregador);
		}
		
		// se informado, valida entregador preferencial
		if (entity.getEntregadorPreferencial() != null) {
			entrega.setPreferencia(pessoaService.find(entity.getEntregadorPreferencial()));
		}
		
		// se informado, valida agendamento
		Agendamento agendamento = new Agendamento();
		if (entity.getAgendamento() != null) {
			agendamento = agendamentoService.find(entity.getAgendamento());
			entrega.setAgendamento(agendamento);
		}
		
		// valida origem
		if (!entregaEnderecoService.isOrigemInList(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Origem não informada.");
		}
		
		// valida destino
		if (!entregaEnderecoService.isDestinoInList(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Destino não informado.");
		}
		
		// valida lista de enderecos para persistir
		if (!entregaEnderecoService.isValidListEntregaEnderecoToPersist(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Endereço(s) inválido(s)");
		}
		
		Entrega entregaPersistida = repository.save(entrega);
		registraEnderecosDaEntrega(entity, entregaPersistida);
		registraStatusEntrega(entregaPersistida, StatusEntrega.NI);
		return entrega;
	}

	@Transactional
	public Entrega update(Entrega entity, Long id) {
		Entrega entrega = find(id);
		BeanUtils.copyProperties(entity, entrega, "id");
		return repository.save(entrega);
	}

	@Transactional
	public void updateHoraSaida(Long id) {
		Entrega entrega = find(id);
		entrega.setHoraSaida(Time.valueOf(LocalTime.now()));
		repository.save(entrega);
	}

	@Transactional
	public void updateHoraChegada(Long id) {
		Entrega entrega = find(id);
		entrega.setHoraChegada(Time.valueOf(LocalTime.now()));
		repository.save(entrega);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	private void registraEnderecosDaEntrega(EntregaDto entity, Entrega entregaPersistida) {
		for (int i = 0; i < entity.getListaEnderecos().size(); i++) {
			EntregaEnderecoDto entregaEnderecoDto = entity.getListaEnderecos().get(i);
			if (entregaEnderecoDto.getMunicipio() == null || toInteger(entregaEnderecoDto.getMunicipio().getId()) <= 0) {
				throw new ExcecaoTempoExecucao("Id do município não informado");
			}
			EntregaEndereco obj = entregaEnderecoService.copyPropertiesToEntregaEndereco(entregaEnderecoDto);
			obj.setEntrega(entregaPersistida);

			// caso latitude ou longitude não tenham sido informados,
			// vai consumir serviços do google para setar valores de lat/lng aqui
			if (obj.getLatitude() == null || obj.getLongitude() == null) {
				String logradouro = obj.getLogradouro();
				String numero = obj.getNumero();
				String bairro = obj.getBairro();
				String cidade = obj.getMunicipio().getNome();
				String estado = obj.getMunicipio().getEstado().getSigla();
				String address = UtilMethods.tratarEnderecoParaGoogleMaps(logradouro, numero, bairro, cidade, estado);
				try {
					Location location = googleMapsService.buscarLatitudeLongitudePorEndereco(address);
					obj.setLatitude(BigDecimal.valueOf(location.getLat()));
					obj.setLongitude(BigDecimal.valueOf(location.getLng()));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			entregaEnderecoService.insert(obj);
		}
	}

	public void registraStatusEntrega(Entrega entrega, StatusEntrega status) {
		EntregaStatus entregaStatus = EntregaStatus
				.builder()
				.entrega(entrega)
				.status(status)
				.build();
		entregaStatusService.insert(entregaStatus);
	}

	private void registraStatusPagamento(Entrega entrega, StatusPagamento status) throws MPException {
		Optional<Pagamento> pagamento = pagamentoService.findByEntrega(entrega);
		if (pagamento.isPresent()) {
			PagamentoStatus pagamentoStatus = PagamentoStatus
					.builder()
					.pagamento(pagamento.get())
					.status(status)
					.build();
			pagamentoStatusService.insert(pagamentoStatus);
		}
	}

	private int toInteger(Long id) {
		if (id == null) {
			return 0;
		}
		return Integer.parseInt(id.toString());
	}

	public CalculoEntregaDto calcularValorEntrega(CalculoEntregaDto entrega) {
		Pessoa cliente = pessoaService.find(entrega.getCliente());
		TabelaPreco tabelaPreco = null;
		if (PessoaService.isPessoaFisica(cliente) || !PessoaService.isParceiro(cliente)) {
			tabelaPreco = tabelaPrecoService.findTabelaPrecoDefaultByTipoVeiculo(entrega.getTipoVeiculo());
		} else {
			tabelaPreco = tabelaPrecoService.findTabelaPrecoByPessoaParceiroAndTipoVeiculo(cliente.getId(), entrega.getTipoVeiculo());
			if (tabelaPreco == null) {
				tabelaPreco = tabelaPrecoService.findTabelaPrecoDefaultByTipoVeiculo(entrega.getTipoVeiculo());
			}
		}

		validarListaEnderecosComCobertura(entrega.getListaEnderecos());
		DirectionsApi directionsApi = obterTrajeto(entrega);
		preencherDistanciaEPrevisao(entrega, directionsApi);
		preencherLatLngListaEnderecos(entrega, directionsApi);
		
		Float kmMinimo = tabelaPreco.getTarifaKm();
		Float valorMinimo = tabelaPreco.getTarifaValor();
		Float tarifaAdicional = 0f;
		
		Time time = new Time(System.currentTimeMillis());
		List<TabelaPrecoItem> items = tabelaPrecoItemRepository.findTabelaPrecoItemByIntervalTimeAndTabelaPreco(time, tabelaPreco);
		TabelaPrecoItem tabelaPrecoItem = items.stream().findFirst().orElse(null);
		if (tabelaPrecoItem != null) {	
			tarifaAdicional = tabelaPrecoItem.getTarifaAdicional();
		}
		
		Float distancia = entrega.getDistancia();
		Float valorTotal = valorMinimo;
		if (distancia > kmMinimo) {
			valorTotal += (distancia - kmMinimo) * tarifaAdicional;
		}
		
		entrega.setValorTotal(valorTotal);
		entrega.setTabelaPreco(tabelaPreco.getId());
		return entrega;
	}

	private void preencherLatLngListaEnderecos(CalculoEntregaDto entrega, DirectionsApi directionsApi) {
		int sizeLegs = directionsApi.getRoutes().get(0).getLegs().size();
		int sizeEnderecos = entrega.getListaEnderecos().size();
		
		for (int i = 0; sizeLegs > i; i++) {
			Leg obj = directionsApi.getRoutes().get(0).getLegs().get(i);
			
			if (entrega.getDeslocamento() == Deslocamento.OD) {
				if (sizeEnderecos == 2) {
					entrega.getListaEnderecos().get(0).setLat(obj.getStartLocation().getLat());
					entrega.getListaEnderecos().get(0).setLng(obj.getStartLocation().getLng());
					entrega.getListaEnderecos().get(1).setLat(obj.getEndLocation().getLat());
					entrega.getListaEnderecos().get(1).setLng(obj.getEndLocation().getLng());
				} else if (sizeEnderecos > 2) {
					if (sizeLegs == i + 1) {
						entrega.getListaEnderecos().get(i).setLat(obj.getStartLocation().getLat());
						entrega.getListaEnderecos().get(i).setLng(obj.getStartLocation().getLng());
						entrega.getListaEnderecos().get(i + 1).setLat(obj.getEndLocation().getLat());
						entrega.getListaEnderecos().get(i + 1).setLng(obj.getEndLocation().getLng());
					} else {
						entrega.getListaEnderecos().get(i).setLat(obj.getStartLocation().getLat());
						entrega.getListaEnderecos().get(i).setLng(obj.getStartLocation().getLng());
					}
				}
			} else {
				entrega.getListaEnderecos().get(i).setLat(obj.getStartLocation().getLat());
				entrega.getListaEnderecos().get(i).setLng(obj.getStartLocation().getLng());
			}
		}
	}

	private String modeToTipoVeiculo(TipoVeiculo tipoVeiculo) {
		if (tipoVeiculo == null) {
			return "";
		}
		if (tipoVeiculo == TipoVeiculo.B) {
			return "bicycling";
		}
		return "driving";
	}

	private void validarListaEnderecosComCobertura(List<EntregaEnderecoLinkCalculoEntregaDto> listaEnderecos) {
		for (EntregaEnderecoLinkCalculoEntregaDto obj : listaEnderecos) {
			if (!municipioService.isMunicipioComCobertura(obj.getCidade(), obj.getEstado())) {
				String tipoEndereco = "indefinido";
				if (obj.getTipoEndereco() != null) {
					tipoEndereco = obj.getTipoEndereco().toString().toLowerCase();
				}
				// TODO elaborar texto de retorno para quando município de um dos endereços não ter cobertura
				throw new ExcecaoTempoExecucao("Endereço de " + tipoEndereco +
						" ainda não possui cobertura do Chamaí." +
						" Município de " + obj.getCidade() + " - " + obj.getEstado() + "."
				);
			}
		}
	}
	
	private DirectionsApi obterTrajeto(CalculoEntregaDto entrega) {
		String origin = "";
		String destination = "";
		String waypoints = "";
		int sizeEnderecos = entrega.getListaEnderecos().size();
		
		if (sizeEnderecos > 2) {
			for (int i = 0; i < entrega.getListaEnderecos().size(); i++) {
				EntregaEnderecoLinkCalculoEntregaDto obj = entrega.getListaEnderecos().get(i);
				if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
					if (!StringUtils.isEmpty(origin)) {
						throw new ExcecaoTempoExecucao("Não pode ter mais de uma origem");
					}
					origin = tratarEnderecoParaGoogleMaps(obj);
				} else {
					if (i == sizeEnderecos - 1 && Objects.equals(entrega.getDeslocamento(), Deslocamento.OD)) {
						destination = tratarEnderecoParaGoogleMaps(obj);
					} else {
						if (StringUtils.isEmpty(waypoints)) {
							waypoints = tratarEnderecoParaGoogleMaps(obj);
						} else {
							waypoints += " | " + tratarEnderecoParaGoogleMaps(obj);
						}
					}
				}
			}
			if (entrega.getDeslocamento() == Deslocamento.ODO) {
				destination = origin;
			}
		} else if (sizeEnderecos == 2) {
			if (Objects.equals(entrega.getDeslocamento(), Deslocamento.OD)) {
				for (EntregaEnderecoLinkCalculoEntregaDto obj : entrega.getListaEnderecos()) {
					if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
						if (!StringUtils.isEmpty(origin)) {
							throw new ExcecaoTempoExecucao("Não pode ter mais de uma origem");
						}
						origin = tratarEnderecoParaGoogleMaps(obj);
					} else {
						destination = tratarEnderecoParaGoogleMaps(obj);
					}
				}
			} else {
				for (EntregaEnderecoLinkCalculoEntregaDto obj : entrega.getListaEnderecos()) {
					if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
						if (!StringUtils.isEmpty(origin)) {
							throw new ExcecaoTempoExecucao("Não pode ter mais de uma origem");
						}
						origin = tratarEnderecoParaGoogleMaps(obj);
						destination = tratarEnderecoParaGoogleMaps(obj);
					} else {
						if (StringUtils.isEmpty(waypoints)) {
							waypoints = tratarEnderecoParaGoogleMaps(obj);
						} else {
							waypoints += " | " + tratarEnderecoParaGoogleMaps(obj);
						}
					}
				}
			}
		}
		
		DirectionsApiParams params = DirectionsApiParams.builder()
				.origin(origin)
				.waypoints(waypoints)
				.destination(destination)
				.mode(modeToTipoVeiculo(entrega.getTipoVeiculo()))
			.build();
		
		try {
			return googleMapsService.directionsApi(params);
		} catch (Exception e) {
			System.out.println("Ocorreu erro " + e.getMessage());
			throw new ExcecaoTempoExecucao("Ocorreu erro ao consumir API directions do Google Maps.");
		}
	}
	
	private void preencherDistanciaEPrevisao(CalculoEntregaDto entrega, DirectionsApi directionsApi) {
		entrega.setDistancia(googleMapsService.getDistanceValueKmsFromDirectionsApi(directionsApi));
		Long duracao = googleMapsService.getDurationValueFromDirectionsApi(directionsApi);
		entrega.setPrevisao(Time.valueOf(LocalTime.ofSecondOfDay(duracao)));
	}

	public String tratarEnderecoParaGoogleMaps(EntregaEnderecoLinkCalculoEntregaDto endereco) {
		return UtilMethods.tratarEnderecoParaGoogleMaps(
				endereco.getLogradouro(), endereco.getNumero(), endereco.getBairro(), endereco.getCidade(), endereco.getEstado()
		);
	}
	
	private EntregadorDto getEntregadorFromVeiculo(Veiculo veiculo, Pessoa entregador) {
		String veiculoStr = veiculo.getTipo().toString().toUpperCase()
				+ ", PLACA: " + veiculo.getPlaca()
				+ ", MODELO: " + veiculo.getModelo();
		EntregadorDto entregadorDto = EntregadorDto.builder()
				.email(entregador.getEmail())
				.telefone(entregador.getTelefone())
				.id(entregador.getId())
				.cpfCnpj(entregador.getCpfCnpj())
				.nome(entregador.getNome())
				.strVeiculo(veiculoStr)
				.veiculo(veiculo.getTipo().toString().toUpperCase())
				.modelo(veiculo.getModelo())
				.placa(veiculo.getPlaca())
			.build();
		return entregadorDto;
	}
}


	// tarifa_km = corresponde a km básica (tarifa mínima)
	// tarifa_valor = corresponde ao valor da quilometragem básica (valor R$ da tarifa mínima)
	
	// ex.: km = 12
	// tarifa_km = 5km
	// tarifa_valor = 10,00
	// calculo = 10,00 correspondente a 5km + tabela preco item correspondente a 7km no horário indicado na tabela
	
	// hora da solic. 12:15
	// tabela preco item - 12 a 14 - tarifa adicional = 6,75
	
	// verificar se é pj ou pf
	// se pj, verificar se existe vinculo com parceiro_tabela_preco, se existe obter os dados desse vinculo para calculo