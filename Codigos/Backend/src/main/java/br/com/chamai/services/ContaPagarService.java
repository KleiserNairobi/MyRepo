package br.com.chamai.services;

import java.util.List;
import br.com.chamai.models.ContaPagar;
import br.com.chamai.models.ParcelaContaPagar;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.repositories.ContaPagarRepository;
import org.springframework.util.StringUtils;

@Service
public class ContaPagarService {
	
	@Autowired private ContaPagarRepository repository;
	@Autowired private ParcelaContaPagarService parcelaContaPagarService;
	
	public List<ContaPagar> findAll() {
		return repository.findAll();
	}
	
	public ContaPagar find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de pagamento com o id " + id)
		);
	}

	@Transactional
	public ContaPagar insert(ContaPagar entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getPessoa() == null || entity.getPessoa().getId() == null) {
			throw new EntidadeNaoEncontrada("Pessoa não informada");
		}
		if (!StringUtils.isEmpty(entity.getHistorico())) {
			entity.setHistorico(entity.getHistorico().toUpperCase());
		}
		entity.setDocumento(entity.getDocumento().toUpperCase());

		ContaPagar contaPagar = repository.save(entity);
		insereParcelaPagar(contaPagar);
		return contaPagar;
	}

	@Transactional
	public ContaPagar update(ContaPagar entity, Long id) {
		ContaPagar contaPagar = find(id);
		BeanUtils.copyProperties(entity, contaPagar, "id");
		if (!StringUtils.isEmpty(entity.getHistorico())) {
			entity.setHistorico(entity.getHistorico().toUpperCase());
		}
		entity.setDocumento(entity.getDocumento().toUpperCase());
		return repository.save(contaPagar);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	private void insereParcelaPagar(ContaPagar contaPagar) {

		var vencimento = contaPagar.getPrimeiroVcto();
		Byte parcelas = contaPagar.getParcelas();
		Double valorTotal = contaPagar.getValorTotal();
		Long valorParcela = Math.round(valorTotal / parcelas);
		Double diferenca = valorTotal - (valorParcela * parcelas);

		for (int i = 1; i <= contaPagar.getParcelas(); i++) {
			ParcelaContaPagar parcelaContaPagar = new ParcelaContaPagar();

			parcelaContaPagar.setContaPagar(contaPagar);
			parcelaContaPagar.setId(parcelaContaPagarService.getNovoId(contaPagar.getId()));
			parcelaContaPagar.setDataEmissao(contaPagar.getEmissao());
			parcelaContaPagar.setDataVencimento(vencimento);
			parcelaContaPagar.setValor((double) valorParcela);
			parcelaContaPagar.setTaxaJuro(0D);
			parcelaContaPagar.setTaxaMulta(0D);
			parcelaContaPagar.setTaxaDesconto(0D);
			parcelaContaPagar.setValorJuro(0D);
			parcelaContaPagar.setValorMulta(0D);
			parcelaContaPagar.setValorDesconto(0D);
			parcelaContaPagar.setDataPagamento(null);
			parcelaContaPagar.setValorPagamento(null);

			if (i == parcelas) {
				if (diferenca > 0) {
					parcelaContaPagar.setValor(valorParcela + diferenca);
				} else {
					parcelaContaPagar.setValor(valorParcela - (diferenca * -1));
				}
			}

			parcelaContaPagarService.insert(parcelaContaPagar);
			vencimento = vencimento.plusDays(30);
		}
	}

}
