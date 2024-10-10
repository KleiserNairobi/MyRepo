package br.com.chamai.services;

import java.time.LocalDate;
import java.util.List;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.ContaCaixa;
import br.com.chamai.models.ContaPagar;
import br.com.chamai.models.MovimentoContaCaixa;
import br.com.chamai.models.ParcelaContaPagar;
import br.com.chamai.models.ParcelaContaPagarPK;
import br.com.chamai.models.PessoaMovimento;
import br.com.chamai.models.enums.OperacaoMovimentoContaCaixa;
import br.com.chamai.models.enums.OperacaoPessoaMovimento;
import br.com.chamai.models.enums.OrigemMovimentoContaCaixa;
import br.com.chamai.repositories.MovimentoContaCaixaRepository;
import br.com.chamai.repositories.ParcelaContaPagarRepository;
import br.com.chamai.repositories.PessoaMovimentoRepository;

@Service
public class ParcelaContaPagarService {
	
	@Autowired private ParcelaContaPagarRepository repository;
	@Autowired private ContaCaixaService contaCaixaService;
	@Autowired private MovimentoContaCaixaRepository movimentoContaCaixaRepository;
	@Autowired private ContaPagarService contaPagarService;
	@Autowired private MovimentoContaCaixaService movimentoContaCaixaService;
	@Autowired private PessoaMovimentoRepository pessoaMovimentoRepository;
	
	public List<ParcelaContaPagar> findAll() {
		return repository.findAll();
	}

	public List<ParcelaContaPagar> findByPagar(ContaPagar contaPagar) {
		return repository.findByPagar(contaPagar);
	}

	public List<ParcelaContaPagar> findByPagar(Long id) {
		ContaPagar contaPagar = contaPagarService.find(id);
		return repository.findByPagar(contaPagar);
	}

	public ParcelaContaPagar find(Long contaPagar, Long id) {
		ParcelaContaPagarPK parcelaContaPagarPK = ParcelaContaPagarPK.builder().id(id).contaPagar(contaPagar).build();
		return repository.findById(parcelaContaPagarPK).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de parcela a pagar " + contaPagar + "/" + id)
		);
	}
	
	@Transactional
	public ParcelaContaPagar efetuarPagamento(ParcelaContaPagar entity) {

		validEntity(entity);
		ContaPagar contaPagar = contaPagarService.find(entity.getContaPagar().getId());
		ParcelaContaPagar parcelaPagar = find(entity.getContaPagar().getId(), entity.getId());

		if (toDouble(parcelaPagar.getValorPagamento()) > 0.0) {
			throw new ExcecaoTempoExecucao(
					"Já existe pagamento para parcela " +
							parcelaPagar.getId() + "/" +
							parcelaPagar.getContaPagar().getParcelas()
			);
		}
		
		BeanUtils.copyProperties(
				parcelaPagar, entity,
				"valorJuro", "taxaJuro", "valorDesconto", "taxaDesconto", "valorMulta", "taxaMulta"
		);
		entity.setValor(parcelaPagar.getValor());
		
		gerarJuro(entity);
		gerarMulta(entity);
		gerarDesconto(entity);
		efetuarCalculos(entity);
		
		entity.setDataPagamento(LocalDate.now());
		ParcelaContaPagar parcela = repository.saveAndFlush(entity);
		
		int ano = entity.getDataPagamento().getYear();
		int mes = entity.getDataPagamento().getMonthValue();
		ContaCaixa contaCaixa = contaCaixaService.caixaInternoByReferencia(ano, mes);

		if (contaCaixa == null) {
			contaCaixa = contaCaixaService.criarContaCaixaInternoPorAnoMes(ano, mes);				
		}
		
		criarMovimentoContaCaixa(entity, contaPagar, contaCaixa);
		movimentoContaCaixaService.atualizarContaCaixa(contaCaixa);
		atualizarContaPagar(contaPagar);
		verificarPessoaMovimentoParaAtualizarQuitado(contaPagar);
		
		return parcela;
	}

	private void verificarPessoaMovimentoParaAtualizarQuitado(ContaPagar conta) {
		pessoaMovimentoRepository.findByPessoaAndDocumentoAndOperacao(
			conta.getPessoa(), conta.getId().toString(), OperacaoPessoaMovimento.C
		).ifPresent((PessoaMovimento obj) -> pessoaMovimentoRepository.updateQuitadoById(obj.getId(), true));
	}

	private void atualizarContaPagar(ContaPagar contasPagar) {
		Double valorTotal = contasPagar.getValorTotal();
		Double valorPago = somarPagamentosByConta(contasPagar);
		contasPagar.setValorPagar( valorTotal - valorPago );
		contaPagarService.update(contasPagar, contasPagar.getId());
	}

	private void criarMovimentoContaCaixa(ParcelaContaPagar entity, ContaPagar contas, ContaCaixa contaCaixa) {
		MovimentoContaCaixa movimentoContaCaixa = MovimentoContaCaixa.builder()
					.contaCaixa(contaCaixa)
					.valor(entity.getValorPagamento())
					.origem(OrigemMovimentoContaCaixa.P)
					.operacao(OperacaoMovimentoContaCaixa.D)
					.documento(getDocumento(entity, contas.getParcelas()))
					.historico("PAGAMENTO DE PARCELA")
					.data(LocalDate.now())
					.categoria(contas.getCategoria())
				.build();
		movimentoContaCaixaRepository.saveAndFlush(movimentoContaCaixa);
	}

	private String getDocumento(ParcelaContaPagar entity, byte qtdParcelas) {
		String documento = "";

		if (StringUtils.isNotBlank(entity.getContaPagar().getDocumento())) {
			documento += entity.getContaPagar().getDocumento() + " - ";
		}

		documento += "PARC. " + entity.getContaPagar().getId() + "/" + qtdParcelas;

		if ( documento.length() > 20) {
			documento = documento.substring(0, 20);
		}

		return documento;
	}

	public double somarPagamentosByConta(ContaPagar conta) {
		return repository.somarPagamentosByConta(conta).orElse(0.0);
	}

	private void validEntity(ParcelaContaPagar entity) {
		if (entity.getContaPagar() == null || entity.getContaPagar().getId() == null || entity.getContaPagar().getId() <= 0) {
			throw new EntidadeNaoEncontrada("Pagar não informado ou inválido");
		}
		if (entity.getId() == null || entity.getId() <= 0) {
			throw new EntidadeNaoEncontrada("Id da parcela não informada ou inválido");
		}
	}
	
	private void gerarJuro(ParcelaContaPagar entity) {
		entity.setValorJuro(toDouble(entity.getValorJuro()));
		entity.setTaxaJuro(toDouble(entity.getTaxaJuro()));
		if (entity.getValorJuro() > 0.0) {
			Double valorDiferenca = toDouble(entity.getValor()) - toDouble(entity.getValorJuro());
			Double taxaJuro = valorDiferenca / toDouble(entity.getValor());
			entity.setTaxaJuro(taxaJuro);
		} else if (toDouble(entity.getTaxaJuro()) > 0.0) {
			entity.setValorJuro(toDouble(entity.getTaxaJuro()) * toDouble(entity.getValor()));
		} else {
			entity.setTaxaJuro(0.0);
			entity.setValorJuro(0.0);
		}
	}
	
	private void gerarMulta(ParcelaContaPagar entity) {
		if (toDouble(entity.getValorMulta()) > 0.0) {
			Double valorDiferenca = toDouble(entity.getValor()) - toDouble(entity.getValorMulta());
			Double taxaMulta = valorDiferenca / toDouble(entity.getValor());
			entity.setTaxaMulta(taxaMulta);
		} else if (toDouble(entity.getTaxaMulta()) > 0.0) {
			entity.setValorMulta(toDouble(entity.getTaxaMulta()) * toDouble(entity.getValor()));
		} else {
			entity.setTaxaMulta(0.0);
			entity.setValorMulta(0.0);
		}
	}

	private void gerarDesconto(ParcelaContaPagar entity) {
		if (toDouble(entity.getValorDesconto()) > 0.0) {
			Double valorDiferenca = toDouble(entity.getValor()) - toDouble(entity.getValorDesconto());
			Double taxaDesconto = valorDiferenca / toDouble(entity.getValor());
			entity.setTaxaDesconto(taxaDesconto);
		} else if (toDouble(entity.getTaxaDesconto()) > 0.0) {
			entity.setValorDesconto(toDouble(entity.getTaxaDesconto()) * toDouble(entity.getValor()));
		} else {
			entity.setTaxaDesconto(0.0);
			entity.setValorDesconto(0.0);
		}
	}
	
	private void efetuarCalculos(ParcelaContaPagar entity) {
		Double valorPagamento = toDouble(entity.getValor());
		valorPagamento += toDouble(entity.getValorJuro());
		valorPagamento += toDouble(entity.getValorMulta());
		valorPagamento -= toDouble(entity.getValorDesconto());
		entity.setValorPagamento(valorPagamento);
	}
	
	private Double toDouble(Double value) {
		if (value == null) {
			return 0.0;
		}
		return value;
	}

	@Transactional
	public ParcelaContaPagar insert(ParcelaContaPagar entity) {
		if (entity.getContaPagar() == null || entity.getContaPagar().getId() == null) {
			throw new EntidadeNaoEncontrada("Pagar não informado");
		}
		return repository.save(entity);
	}

	@Transactional
	public ParcelaContaPagar update(ParcelaContaPagar entity, Long pagar, Long id) {
		ParcelaContaPagar parcelaContaPagar = find(pagar, id);
		BeanUtils.copyProperties(entity, parcelaContaPagar, "id", "pagar");
		return repository.save(parcelaContaPagar);
	}

	@Transactional
	public void delete(Long contaPagar, Long id) {
		find(contaPagar, id);
		ParcelaContaPagarPK parcelaContaPagarPK = ParcelaContaPagarPK.builder().id(id).contaPagar(contaPagar).build();
		repository.deleteById(parcelaContaPagarPK);
	}

	public Long getNovoId(long idPagar) {
		ParcelaContaPagar parcela = repository.getUltimoID(idPagar);
		if (parcela == null) {
			return 1L;
		} else {
			return parcela.getId() + 1;
		}
	}

}
