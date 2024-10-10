package br.com.chamai.services;

import java.time.LocalDate;
import java.util.List;

import br.com.chamai.models.*;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.enums.OperacaoMovimentoContaCaixa;
import br.com.chamai.models.enums.OperacaoPessoaMovimento;
import br.com.chamai.models.enums.OrigemMovimentoContaCaixa;
import br.com.chamai.repositories.MovimentoContaCaixaRepository;
import br.com.chamai.repositories.ParcelaContaReceberRepository;
import br.com.chamai.repositories.PessoaMovimentoRepository;

@Service
public class ParcelaContaReceberService {
	
	@Autowired private ParcelaContaReceberRepository repository;
	@Autowired private MovimentoContaCaixaRepository movimentoContaCaixaRepository;
	@Autowired private ContaReceberService contaReceberService;
	@Autowired private ContaCaixaService contaCaixaService;
	@Autowired private MovimentoContaCaixaService movimentoContaCaixaService;
	@Autowired private PessoaMovimentoRepository pessoaMovimentoRepository;
	
	public List<ParcelaContaReceber> findAll() {
		return repository.findAll();
	}

	public List<ParcelaContaReceber> findByReceber(Long receber) {
		ContaReceber contaReceber = contaReceberService.find(receber);
		return repository.findByReceber(contaReceber);
	}

	public ParcelaContaReceber find(Long receber, Long id) {
		ParcelaContaReceberPK parcelaContaReceberPK = ParcelaContaReceberPK.builder().contaReceber(receber).id(id).build();
		return repository.findById(parcelaContaReceberPK).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de parcela a receber com o id " + id)
		);
	}
	
	@Transactional
	public ParcelaContaReceber efetuarRecebimento(ParcelaContaReceber entity) {

		validEntity(entity);
		ContaReceber contaReceber = contaReceberService.find(entity.getContaReceber().getId());
		ParcelaContaReceber parcelaReceber = find(entity.getContaReceber().getId(), entity.getId());

		if (toDouble(parcelaReceber.getValorRecebimento()) > 0.0) { // verifica se parcela já foi quitada
			throw new ExcecaoTempoExecucao(
					"Já existe pagamento para parcela " +
							parcelaReceber.getId() + "/" + parcelaReceber
							.getContaReceber().getParcelas()
			);
		}
		
		BeanUtils.copyProperties(
				parcelaReceber, entity,
				"valorJuro","taxaJuro","valorDesconto","taxaDesconto","valorMulta","taxaMulta"
		);

		entity.setValor(parcelaReceber.getValor());
		
		gerarJuro(entity);
		gerarMulta(entity);
		gerarDesconto(entity);
		efetuarCalculos(entity);
		
		entity.setDataRecebimento(LocalDate.now());
		ParcelaContaReceber parcela = repository.saveAndFlush(entity);
		
		int ano = entity.getDataRecebimento().getYear();
		int mes = entity.getDataRecebimento().getMonthValue();
		ContaCaixa contaCaixa = contaCaixaService.caixaInternoByReferencia(ano, mes);

		if (contaCaixa == null) {
			contaCaixa = contaCaixaService.criarContaCaixaInternoPorAnoMes(ano, mes);				
		}
		
		criarMovimentoContaCaixa(entity, contaReceber, contaCaixa);
		movimentoContaCaixaService.atualizarContaCaixa(contaCaixa);
		atualizarContaReceber(contaReceber);
		verificarPessoaMovimentoParaAtualizarQuitado(contaReceber);
		
		return parcela;
	}

	private void verificarPessoaMovimentoParaAtualizarQuitado(ContaReceber conta) {
		pessoaMovimentoRepository.findByPessoaAndDocumentoAndOperacao(
			conta.getPessoa(), conta.getId().toString(), OperacaoPessoaMovimento.D
		).ifPresent((PessoaMovimento obj) -> pessoaMovimentoRepository.updateQuitadoById(obj.getId(), true));
	}

	@Transactional
	public ParcelaContaReceber insert(ParcelaContaReceber entity) {
		if (entity.getContaReceber() == null || entity.getContaReceber().getId() == null) {
			throw new EntidadeNaoEncontrada("Receber não informado");
		}
		return repository.save(entity);
	}

	@Transactional
	public ParcelaContaReceber update(ParcelaContaReceber entity, Long receber, Long id) {
		ParcelaContaReceber parcelaContaReceber = find(receber, id);
		BeanUtils.copyProperties(entity, parcelaContaReceber, "id", "receber");
		return repository.save(parcelaContaReceber);
	}

	@Transactional
	public void delete(Long receber, Long id) {
		find(receber, id);
		ParcelaContaReceberPK parcelaContaReceberPK = ParcelaContaReceberPK.builder().contaReceber(receber).id(id).build();
		repository.deleteById(parcelaContaReceberPK);
	}

	public Long getNovoId(long idReceber) {
		ParcelaContaReceber parcela = repository.getUltimoID(idReceber);
		if (parcela == null) {
			return 1L;
		} else {
			return parcela.getId() + 1;
		}
	}

	private void validEntity(ParcelaContaReceber entity) {
		if (entity.getContaReceber() == null || entity.getContaReceber().getId() == null || entity.getContaReceber().getId() <= 0) {
			throw new EntidadeNaoEncontrada("Receber não informado ou inválido");
		}
		if (entity.getId() == null || entity.getId() <= 0) {
			throw new EntidadeNaoEncontrada("Id da parcela não informada ou inválido");
		}
	}
	
	private void gerarJuro(ParcelaContaReceber entity) {
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
	
	private void gerarMulta(ParcelaContaReceber entity) {
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

	private void gerarDesconto(ParcelaContaReceber entity) {
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
	
	private void efetuarCalculos(ParcelaContaReceber entity) {
		Double valorPagamento = toDouble(entity.getValor());
		valorPagamento += toDouble(entity.getValorJuro());
		valorPagamento += toDouble(entity.getValorMulta());
		valorPagamento -= toDouble(entity.getValorDesconto());
		entity.setValorRecebimento(valorPagamento);
	}
	
	private Double toDouble(Double value) {
		if (value == null) {
			return 0.0;
		}
		return value;
	}

	private void criarMovimentoContaCaixa(ParcelaContaReceber entity, ContaReceber contas, ContaCaixa contaCaixa) {
		MovimentoContaCaixa movimentoContaCaixa = MovimentoContaCaixa.builder()
					.contaCaixa(contaCaixa)
					.valor(entity.getValorRecebimento())
					.origem(OrigemMovimentoContaCaixa.R)
					.operacao(OperacaoMovimentoContaCaixa.C)
					.documento(getDocumento(entity, contas.getParcelas()))
					.historico("RECEBIMENTO DE PARCELA")
					.data(LocalDate.now())
					.categoria(contas.getCategoria())
				.build();
		movimentoContaCaixaRepository.saveAndFlush(movimentoContaCaixa);
	}

	private String getDocumento(ParcelaContaReceber entity, byte qtdParcelas) {
		String documento = "";

		if (StringUtils.isNotBlank(entity.getContaReceber().getDocumento())) {
			documento += entity.getContaReceber().getDocumento() + " - ";
		}

		documento += "PARC. " + entity.getContaReceber().getId() + "/" + qtdParcelas;

		if (documento.length() > 20) {
			documento = documento.substring(0, 20);
		}

		return documento;
	}

	private void atualizarContaReceber(ContaReceber contasReceber) {
		Double valorTotal = contasReceber.getValorTotal();
		Double valorRecebido = somarRecebimentosByConta(contasReceber);
		contasReceber.setValorReceber(valorTotal - valorRecebido);
		contaReceberService.update(contasReceber, contasReceber.getId());
	}

	private double somarRecebimentosByConta(ContaReceber conta) {
		return repository.somarRecebimentosByConta(conta).orElse(0.0);
	}

}
