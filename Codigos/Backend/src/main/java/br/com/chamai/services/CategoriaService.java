package br.com.chamai.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Categoria;
import br.com.chamai.repositories.CategoriaRepository;

@Service
public class CategoriaService {
	
	@Autowired CategoriaRepository repository;
	
	public List<Categoria> findAll() {
		return repository.findAllWithOrderBy();
	}
	
	public Categoria find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de categoria com o id " + id)
		);
	}

	@Transactional
	public Categoria insert(Categoria entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		entity.setDescricao(entity.getDescricao().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Categoria update(Categoria entity, Long id) {
		Categoria categoria = find(id);
		BeanUtils.copyProperties(entity, categoria, "id");
		categoria.setDescricao(categoria.getDescricao().toUpperCase());
		return repository.save(categoria);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
