package br.com.chamai.services;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.models.dto.AprovacaoDto;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Aprovacao;
import br.com.chamai.repositories.AprovacaoRepository;

@Service
public class AprovacaoService {
	
	@Autowired AprovacaoRepository repository;
	
	public List<Aprovacao> findAll() {
		return repository.findAll();
	}
	
	public Aprovacao find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de aprovação com o id " + id)
		);
	}

	@Transactional
	public Aprovacao insert(Aprovacao entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getPessoa() == null || entity.getPessoa().getId() == null) {
			throw new EntidadeNaoEncontrada("Pessoa não informada");
		}

		entity.setData(LocalDate.now());
		entity.setHora(Time.valueOf(LocalTime.now()));
		return repository.save(entity);
	}

	@Transactional
	public Aprovacao update(Aprovacao entity, Long id) {
		Aprovacao aprovacao = find(id);
		BeanUtils.copyProperties(entity, aprovacao, "id");
		aprovacao.setData(LocalDate.now());
		aprovacao.setHora(Time.valueOf(LocalTime.now()));
		return repository.save(aprovacao);
	}

	@Transactional
	public Aprovacao updateStatus(AprovacaoDto entity, Long id) {
		Aprovacao aprovacao = find(id);
		aprovacao.setData(LocalDate.now());
		aprovacao.setHora(Time.valueOf(LocalTime.now()));
		aprovacao.setStatusAprovacao(entity.getStatusAprovacao());
		return repository.save(aprovacao);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
