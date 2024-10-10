package br.com.chamai.services;

import java.util.List;
import br.com.chamai.models.ContaReceber;
import br.com.chamai.models.ParcelaContaReceber;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.repositories.ContaReceberRepository;
import org.springframework.util.StringUtils;

@Service
public class ContaReceberService {
	
	@Autowired private ContaReceberRepository repository;
	@Autowired private ParcelaContaReceberService parcelaContaReceberService;
	
	public List<ContaReceber> findAll() {
		return repository.findAll();
	}
	
	public ContaReceber find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de pagamento com o id " + id)
		);
	}

	@Transactional
	public ContaReceber insert(ContaReceber entity) {
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

		ContaReceber contaReceber = repository.save(entity);
		insereParcelaReceber(contaReceber);
		return contaReceber;
	}

	@Transactional
	public ContaReceber update(ContaReceber entity, Long id) {
		ContaReceber contaReceber = find(id);
		BeanUtils.copyProperties(entity, contaReceber, "id");
		return repository.save(contaReceber);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	private void insereParcelaReceber(ContaReceber contaReceber) {

		var vencimento = contaReceber.getPrimeiroVcto();
		Byte parcelas = contaReceber.getParcelas();
		Double valorTotal = contaReceber.getValorTotal();
		Long valorParcela = Math.round(valorTotal / parcelas);
		Double diferenca = valorTotal - (valorParcela * parcelas);

		for (int i = 1; i <= contaReceber.getParcelas(); i++) {
			ParcelaContaReceber parcelaContaReceber = new ParcelaContaReceber();

			parcelaContaReceber.setContaReceber(contaReceber);
			parcelaContaReceber.setId(parcelaContaReceberService.getNovoId(contaReceber.getId()));
			parcelaContaReceber.setDataEmissao(contaReceber.getEmissao());
			parcelaContaReceber.setDataVencimento(vencimento);
			parcelaContaReceber.setValor((double) valorParcela);
			parcelaContaReceber.setTaxaJuro(0D);
			parcelaContaReceber.setTaxaMulta(0D);
			parcelaContaReceber.setTaxaDesconto(0D);
			parcelaContaReceber.setValorJuro(0D);
			parcelaContaReceber.setValorMulta(0D);
			parcelaContaReceber.setValorDesconto(0D);
			parcelaContaReceber.setDataRecebimento(null);
			parcelaContaReceber.setValorRecebimento(null);

			if (i == parcelas) {
				if (diferenca > 0) {
					parcelaContaReceber.setValor(valorParcela + diferenca);
				} else {
					parcelaContaReceber.setValor(valorParcela - (diferenca * -1));
				}
			}

			parcelaContaReceberService.insert(parcelaContaReceber);
			vencimento = vencimento.plusDays(30);
		}
	}



}
