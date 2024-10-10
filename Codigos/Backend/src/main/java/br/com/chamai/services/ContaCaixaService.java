package br.com.chamai.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.ContaCaixa;
import br.com.chamai.models.enums.TipoContaCaixa;
import br.com.chamai.repositories.ContaCaixaRepository;

@Service
public class ContaCaixaService {
	
	@Autowired private ContaCaixaRepository repository;

	public ContaCaixa criarContaCaixaInternoPorAnoMes(int ano, int mes) {
		ContaCaixa caixaAnterior = caixaInternoByReferenciaAnterior(ano, mes);
		ContaCaixa contaCaixa = ContaCaixa.builder()
				.referencia(ano + "/" + mes)
				.tipoContaCaixa(TipoContaCaixa.X)
				.nome("CAIXA INTERNO GERADO AUTOMATICAMENTE")
				.movimentoRecebimento(0.0)
				.movimentoPagamento(0.0)
				.saldoAnterior(0.0)
			.build();
		if (caixaAnterior != null) { // se existir algum conta caixa anterior do tipo interno
			contaCaixa.setSaldoAnterior(toDouble(caixaAnterior.getSaldoDisponivel())); // pega o saldo disponível do caixa anterior
		}
		return insert(contaCaixa);
	}
	
	public List<ContaCaixa> findAll() {
		return repository.findAll();
	}
	
	public ContaCaixa caixaInternoByReferencia(int ano, int mes) {
		return caixaByReferenciaTipo(ano, mes, TipoContaCaixa.X);
	}
	
	public ContaCaixa caixaByReferenciaTipo(int ano, int mes, TipoContaCaixa tipo) {
		return repository.caixaByReferenciaTipo(ano + "/" + mes, tipo.name()).orElse(null);
	}
	
	public ContaCaixa caixaInternoByReferenciaAnterior(int ano, int mes) {
		return caixaByReferenciaAnteriorTipo(ano, mes, TipoContaCaixa.X);
	}
	
	public ContaCaixa caixaByReferenciaAnteriorTipo(int ano, int mes, TipoContaCaixa tipo) {
		return repository.caixaInternoByReferenciaAnterior(ano + "/" + mes, tipo.name()).orElse(null);
	}
	
	public ContaCaixa find(Long id) {
		return repository.findById(id).orElseThrow(
			() -> new EntidadeNaoEncontrada("Não existe um cadastro de conta caixa com o id " + id)
		);
	}

	@Transactional
	public ContaCaixa insert(ContaCaixa entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}

		entity.setNome(entity.getNome().toUpperCase());
		entity.setMovimentoPagamento(0d);
		entity.setMovimentoRecebimento(0d);
		entity.setSaldoAtual(0d);
		entity.setSaldoDisponivel(entity.getSaldoAnterior());
		return repository.save(entity);
	}

	@Transactional
	public ContaCaixa update(ContaCaixa entity, Long id) {
		ContaCaixa caixa = find(id);

		caixa.setConta(entity.getConta());
		caixa.setReferencia(entity.getReferencia());
		caixa.setTipoContaCaixa(entity.getTipoContaCaixa());
		caixa.setNome(entity.getNome().toUpperCase());
		caixa.setSaldoAnterior(entity.getSaldoAnterior());
		caixa.setSaldoDisponivel(
				entity.getSaldoAnterior() + caixa.getMovimentoRecebimento() - caixa.getMovimentoPagamento()
		);

		return repository.save(caixa);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}
	
	private Double toDouble(Double value) {
		if (value == null) {
			return 0.0;
		}
		return value;
	}

}
