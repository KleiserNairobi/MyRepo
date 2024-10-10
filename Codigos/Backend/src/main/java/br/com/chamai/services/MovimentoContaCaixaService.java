package br.com.chamai.services;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.ContaCaixa;
import br.com.chamai.models.MovimentoContaCaixa;
import br.com.chamai.repositories.MovimentoContaCaixaRepository;


@Service
public class MovimentoContaCaixaService {
	
	@Autowired private MovimentoContaCaixaRepository repository;
	@Autowired private ContaCaixaService contaCaixaService;
	
	public List<MovimentoContaCaixa> findAll() {
		return repository.findAll();
	}
	
	public MovimentoContaCaixa find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de conta caixa com o id " + id)
		);
	}
	
	public double somarPagamentosByAnoMes(int ano, int mes) {
		LocalDate dataInicial = LocalDate.of(ano, mes, 1);
		LocalDate dataFim = LocalDate.of(ano, mes, LocalDate.now().lengthOfMonth());
		return repository.somarPagamentosByPeriodo(dataInicial, dataFim).orElse(0.0);
	}
	
	public double somarRecebimentosByAnoMes(int ano, int mes) {
		LocalDate dataInicial = LocalDate.of(ano, mes, 1);
		LocalDate dataFim = LocalDate.of(ano, mes, LocalDate.now().lengthOfMonth());
		return repository.somarRecebimentosByPeriodo(dataInicial, dataFim).orElse(0.0);
	}

	private int toInteger(String value) {
		if (value == null) {
			return 0;
		}
		return Integer.parseInt(value);
	}

	public void atualizarContaCaixa(ContaCaixa contaCaixa) {
		String referencia[] = contaCaixa.getReferencia().split("/");
		if (referencia == null || referencia.length < 2) {
			throw new ExcecaoTempoExecucao("Referência está incorreta. Deve ser informado no formato aaaa/mm.");
		}
		int ano = toInteger(referencia[0]);
		int mes = toInteger(referencia[1]);
		if (ano <= 0 || mes <= 0) {
			throw new ExcecaoTempoExecucao("Referência está incorreta. Ano e mês devem ser maior que zero.");
		}
		contaCaixa.setMovimentoPagamento(somarPagamentosByAnoMes(ano, mes));
		contaCaixa.setMovimentoRecebimento(somarRecebimentosByAnoMes(ano, mes));
		contaCaixa.setSaldoAtual(contaCaixa.getMovimentoRecebimento() - contaCaixa.getMovimentoPagamento());
		contaCaixa.setSaldoDisponivel(contaCaixa.getSaldoAnterior() + contaCaixa.getSaldoAtual());
		contaCaixaService.update(contaCaixa, contaCaixa.getId());
	}

	@Transactional
	public MovimentoContaCaixa insert(MovimentoContaCaixa entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getContaCaixa() == null || entity.getContaCaixa().getId() == null) {
			throw new EntidadeNaoEncontrada("Conta caixa não informado");
		}
		MovimentoContaCaixa savedEntity = repository.save(entity);
		atualizarContaCaixa(savedEntity.getContaCaixa());
		return savedEntity;
	}
	
	@Transactional
	public MovimentoContaCaixa update(MovimentoContaCaixa entity, Long id) {
		MovimentoContaCaixa movimentoCaixa = find(id);
		BeanUtils.copyProperties(entity, movimentoCaixa, "id");
		MovimentoContaCaixa savedEntity = repository.save(entity);
		atualizarContaCaixa(savedEntity.getContaCaixa());
		return savedEntity;
	}

	@Transactional
	public void delete(Long id) {
		MovimentoContaCaixa movimentoCaixa = find(id);
		repository.deleteById(id);
		atualizarContaCaixa(movimentoCaixa.getContaCaixa());
	}

}
