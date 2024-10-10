package br.com.chamai.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import br.com.chamai.models.*;
import br.com.chamai.models.dto.AgendamentoDto;
import br.com.chamai.models.dto.AgendamentoEnderecoDto;
import br.com.chamai.models.dto.RespostaCancelaAgendamentoDto;
import br.com.chamai.models.enums.OrigemPagar;
import br.com.chamai.models.enums.TipoPagamento;
import br.com.chamai.repositories.ContaPagarRepository;
import br.com.chamai.repositories.ParcelaContaPagarRepository;
import br.com.chamai.util.maps.geocode.Location;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.repositories.AgendamentoRepository;
import br.com.chamai.util.UtilMethods;

@Service
public class AgendamentoService {
	
	@Autowired private AgendamentoRepository repository;
	@Autowired private AgendamentoEnderecoService agendamentoEnderecoService;
	@Autowired private PessoaService pessoaService;
	@Autowired private GoogleMapsService googleMapsService;
	@Autowired private MoedaService moedaService;
	@Autowired private CategoriaService categoriaService;
	@Autowired private ContaPagarRepository contaPagarRepository;
	@Autowired private ParcelaContaPagarRepository parcelaContaPagarRepository;
	@Autowired private ParcelaContaPagarService parcelaContaPagarService;

	public List<Agendamento> findAll() {
		Pessoa pessoa = new UtilMethods().getPessoaFromUsuarioLogado();
		if (PessoaService.isCliente(pessoa)) {
			return repository.findAllByCliente(pessoa);
		}
		if (PessoaService.isEntregador(pessoa)) {
			return repository.findAllByEntregador(pessoa);
		}
		if (PessoaService.isColaborador(pessoa)) {
			return repository.findAll();
		}
		return new ArrayList<>();
	}
	
	public Agendamento find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de agendamento com o id " + id)
		);
	}

	@Transactional
	public Agendamento insert(AgendamentoDto entity) {

		Agendamento agendamento = new Agendamento();
		BeanUtils.copyProperties(entity, agendamento, "id");

		// valida cliente
		Pessoa cliente = pessoaService.find(entity.getCliente());
		if (!cliente.getCliente()) {
			throw new ExcecaoTempoExecucao("Pessoa informada não é cliente.");
		}
		agendamento.setCliente(cliente);

		// se informado, valida entregador
		Pessoa entregador = new Pessoa();
		if (entity.getEntregador() != null) {
			entregador = pessoaService.find(entity.getEntregador());
			agendamento.setEntregador(entregador);
		}

		// valida origem
		if (!agendamentoEnderecoService.isOrigemInList(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Origem não informada.");
		}

		// valida destino
		if (!agendamentoEnderecoService.isDestinoInList(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Destino não informado.");
		}

		// valida lista de enderecos para persistir
		if (!agendamentoEnderecoService.isValidListAgendamentoEnderecoToPersist(entity.getListaEnderecos())) {
			throw new ExcecaoTempoExecucao("Endereço(s) inválido(s)");
		}

		Agendamento agendamentoPersistido = repository.save(agendamento);
		registraEnderecosDoAgendamento(entity, agendamentoPersistido);

		if (agendamento.getQtdeRepeticao() > 1) {
			geraRepeticoes(entity, agendamento, agendamentoPersistido, cliente, entregador);
		}

		return agendamentoPersistido;
	}

	private void geraRepeticoes(
			AgendamentoDto entity,
			Agendamento agendamento,
			Agendamento agendamentoPersistido,
			Pessoa cliente,
			Pessoa entregador
	) {
		LocalDate dataExecucao = agendamento.getDataExecucao();
		for (int i = 1; i < agendamento.getQtdeRepeticao(); i++) {
			Agendamento novoAgendamento = new Agendamento();
			BeanUtils.copyProperties(entity, novoAgendamento, "id");

			switch (novoAgendamento.getTipoAgendamento()) {
				case D : dataExecucao = dataExecucao.plusDays(1); break;
				case S : dataExecucao = dataExecucao.plusWeeks(1); break;
				case Q : dataExecucao = dataExecucao.plusWeeks(2); break;
				case M : dataExecucao = dataExecucao.plusMonths(1); break;
			}

			novoAgendamento.setCliente(cliente);
			novoAgendamento.setIdOrigem(agendamentoPersistido.getId());
			novoAgendamento.setDataExecucao(dataExecucao);
			novoAgendamento.setQtdeRepeticao(1);

			if (entregador.getId() != null) {
				novoAgendamento.setEntregador(entregador);
			}

			Agendamento agendamentoPersistido2 = repository.save(novoAgendamento);
			registraEnderecosDoAgendamento(entity, agendamentoPersistido2);
		}
	}

	@Transactional
	public Agendamento update(Agendamento entity, Long id) {
		Agendamento agendamento = find(id);
		BeanUtils.copyProperties(entity, agendamento, "id");
		return repository.save(agendamento);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	@Transactional
	public RespostaCancelaAgendamentoDto cancela(Long id, String tipo) {
		Agendamento agendamento = find(id);
		Long idOrigem = agendamento.getIdOrigem();
		RespostaCancelaAgendamentoDto resposta = new RespostaCancelaAgendamentoDto();

		if (tipo.equals("U")) {
			if (!agendamento.getAtivo()) {
				throw new ExcecaoTempoExecucao(
						"O agendamento de nr. " + id + " já se encontra cancelado."
				);
			}
			agendamento.setAtivo(false);
			repository.save(agendamento);
			Float valorDevolver = repository.getValorDevolverUnico(idOrigem == null ? id : idOrigem);
			Long idCP = setContaAPagar(
					agendamento.getCliente(),
					idOrigem == null ? id : idOrigem,
					valorDevolver,
					TipoPagamento.D
			);
			resposta.setIdContaPagar(idCP);
			resposta.setValorDevolver(valorDevolver);
		} else if (tipo.equals("T")) {
			Float valorDevolver = repository.getValorDevolverTodos(idOrigem == null ? id : idOrigem);
			repository.cancelaNaoRealizadosById(idOrigem == null ? id : idOrigem);
			Long idCP = setContaAPagar(
					agendamento.getCliente(),
					idOrigem == null ? id : idOrigem,
					valorDevolver,
					TipoPagamento.D
			);
			resposta.setIdContaPagar(idCP);
			resposta.setValorDevolver(valorDevolver);
		}
		return resposta;
	}

	private void registraEnderecosDoAgendamento(AgendamentoDto entity, Agendamento agendamentoPersistido) {
		for (int i = 0; i < entity.getListaEnderecos().size(); i++) {
			AgendamentoEnderecoDto agendamentoEnderecoDto = entity.getListaEnderecos().get(i);
			if (agendamentoEnderecoDto.getMunicipio() == null || toInteger(agendamentoEnderecoDto.getMunicipio().getId()) <= 0) {
				throw new ExcecaoTempoExecucao("Id do município não informado");
			}
			AgendamentoEndereco obj = agendamentoEnderecoService.copyPropertiesToAgendamentoEndereco(agendamentoEnderecoDto);
			obj.setAgendamento(agendamentoPersistido);

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
			agendamentoEnderecoService.insert(obj);
		}
	}

	private int toInteger(Long id) {
		if (id == null) {
			return 0;
		}
		return Integer.parseInt(id.toString());
	}

	private Long setContaAPagar(Pessoa pessoa, Long idDocumento, Float valor, TipoPagamento tipoPgto) {
		Categoria categoria = categoriaService.find((long) 4);

		ContaPagar contaPagar = new ContaPagar();
		contaPagar.setPessoa(pessoa);
		contaPagar.setCategoria(categoria);
		contaPagar.setMoeda(getMoeda(tipoPgto));
		contaPagar.setOrigem(OrigemPagar.A);
		contaPagar.setDocumento(idDocumento.toString());
		contaPagar.setParcelas((byte) 1);
		contaPagar.setEmissao(LocalDate.now());
		contaPagar.setPrimeiroVcto(LocalDate.now().plusDays(1));
		contaPagar.setValorTotal(valor.doubleValue());
		contaPagar.setValorPagar(valor.doubleValue());
		ContaPagar novoContaPagar = contaPagarRepository.save(contaPagar);

		ParcelaContaPagar parcelaContaPagar = new ParcelaContaPagar();
		parcelaContaPagar.setContaPagar(novoContaPagar);
		parcelaContaPagar.setId(parcelaContaPagarService.getNovoId(novoContaPagar.getId()));
		parcelaContaPagar.setDataEmissao(LocalDate.now());
		parcelaContaPagar.setDataVencimento(LocalDate.now().plusDays(1));
		parcelaContaPagar.setValor((double) valor);
		parcelaContaPagar.setTaxaJuro((double) 0);
		parcelaContaPagar.setTaxaMulta((double) 0);
		parcelaContaPagar.setTaxaDesconto((double) 0);
		parcelaContaPagar.setValorJuro((double) 0);
		parcelaContaPagar.setValorMulta((double) 0);
		parcelaContaPagar.setValorDesconto((double) 0);
		parcelaContaPagar.setDataPagamento(null);
		parcelaContaPagar.setValorPagamento((double) 0);
		parcelaContaPagarRepository.save(parcelaContaPagar);
		return novoContaPagar.getId();
	}

	private Moeda getMoeda(TipoPagamento tipoPgto) {
		Moeda moeda = new Moeda();
		if (tipoPgto.equals(TipoPagamento.D)) {
			moeda = moedaService.find(1L);
		}
		if (tipoPgto.equals(TipoPagamento.CC)) {
			moeda = moedaService.find(2L);
		}
		if (tipoPgto.equals(TipoPagamento.CD)) {
			moeda = moedaService.find(3L);
		}
		return moeda;
	}

}
