package br.com.chamai.services;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Permissao;
import br.com.chamai.repositories.PermissaoRepository;

import java.util.List;

@Service
public class PermissaoService {
	
	@Autowired private PermissaoRepository repository;

	public List<Permissao> findAll() {
		return repository.findAll();
	}

	public Permissao find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de permissão com o id " + id)
		);
	}
	
	public Permissao insert(Permissao entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		entity.setNome(entity.getNome().toUpperCase());
		if (!entity.getNome().startsWith("ROLE_")) {
			throw new ExcecaoTempoExecucao("O Nome da permissão deve começar com 'ROLE_'");
		}
		entity.setNome(entity.getNome().toUpperCase());
		return repository.save(entity);
	}
	
	public Permissao update(Permissao entity, Long id) {
		Permissao permissao = find(id);
		if (!entity.getNome().startsWith("ROLE_")) {
			throw new ExcecaoTempoExecucao("O Nome da permissão deve começar com 'ROLE_'");
		}
		permissao.setNome(entity.getNome().toUpperCase());
		return repository.save(permissao);
	}
	
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
