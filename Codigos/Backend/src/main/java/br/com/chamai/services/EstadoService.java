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
import br.com.chamai.models.Estado;
import br.com.chamai.repositories.EstadoRepository;
import br.com.chamai.repositories.filters.EstadoFilter;

@Service
public class EstadoService {
	
	@Autowired private EstadoRepository repository;
	
	public List<Estado> findAll() {
		return repository.findAll();
	}
	
	public Page<Estado> findPage(EstadoFilter filter, Pageable pageable) {
		return repository.filtrar(filter, pageable);
	}

	public Estado find(String sigla) {
		String mensagem = "Não existe um cadastro de estado com a sigla ";
		return repository.findById(sigla.toUpperCase()).orElseThrow(
				() -> new EntidadeNaoEncontrada(mensagem + sigla.toUpperCase())
		);
	}

	@Transactional
	public Estado insert(Estado entity) {
		if (entity.getSigla() == null) {
			throw new ExcecaoTempoExecucao("A sigla do estado está nula");
		}
		entity.setSigla(entity.getSigla().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Estado update(Estado entity, String sigla) {
		Estado estado = find(sigla.toUpperCase());
		BeanUtils.copyProperties(entity, estado, "id");
		return repository.save(estado);
	}
	
	@Transactional
	public void delete(String sigla) {
		find(sigla);
		repository.deleteById(sigla.toUpperCase());
	}

}
