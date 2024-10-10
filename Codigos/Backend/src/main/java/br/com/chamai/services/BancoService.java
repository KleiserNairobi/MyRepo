package br.com.chamai.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Banco;
import br.com.chamai.repositories.BancoRepository;
import br.com.chamai.repositories.filters.BancoFilter;

@Service
public class BancoService {
	
	@Autowired private BancoRepository repository;
	
	public List<Banco> findAll() {
		return repository.findAll();
	}
	
	public Page<Banco> findPage(BancoFilter filter, Pageable pageable) {
		return repository.filtrar(filter, pageable);
	}
	
	public Banco find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de banco com o id " + id)
		);
	}

	@Transactional
	public Banco insert(Banco entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao(
					"Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
			);
		}
		entity.setCodigo(entity.getCodigo().toUpperCase());
		entity.setNome(entity.getNome().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Banco update(Banco entity, Long id) {
		Banco banco = find(id);
		banco.setCodigo(entity.getCodigo().toUpperCase());
		banco.setNome(entity.getNome().toUpperCase());
		return repository.save(banco);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
