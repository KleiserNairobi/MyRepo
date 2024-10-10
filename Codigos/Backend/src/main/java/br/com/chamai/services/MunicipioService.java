package br.com.chamai.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Estado;
import br.com.chamai.models.Municipio;
import br.com.chamai.repositories.MunicipioRepository;
import br.com.chamai.repositories.filters.MunicipioFilter;


@Service
public class MunicipioService {
	
	@Autowired private MunicipioRepository repository;
	@Autowired private EstadoService estadoService;
	
	public List<Municipio> findAll() {
		return repository.findAll();
	}
	
	public Page<Municipio> findPage(MunicipioFilter filter, Pageable pageable) {
		return repository.filtrar(filter, pageable);
	}
	
	public Municipio find(Long id) {
		String mensagem = "Não existe um cadastro de município com o id " + id;
		return repository.findById(id).orElseThrow(() -> new EntidadeNaoEncontrada(mensagem));
	}
	
	public List<Municipio> listByEstado(String uf) {
		Estado estado = estadoService.find(uf.toUpperCase());
		return repository.findByEstado(estado);
	}
	
	public Boolean isMunicipioComCobertura(String nome, String uf) {
		Estado estado = estadoService.find(uf.toUpperCase());
		findByNomeAndEstado(nome.toUpperCase(), uf.toUpperCase());
		return repository.isMunicipioComCobertura(nome.toUpperCase(), estado);
	}

	@Transactional
	public Municipio insert(Municipio entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao(
					"Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
			);
		}

		if (entity.getEstado().getSigla() == null) {
			throw new ExcecaoTempoExecucao("A sigla do estado está nula");
		}

		Estado estado = estadoService.find(entity.getEstado().getSigla().toUpperCase());
		entity.setEstado(estado);
		return repository.save(entity);
	}

	@Transactional
	public Municipio update(Municipio entity, Long id) {
		Municipio municipio = find(id);
		BeanUtils.copyProperties(entity, municipio, "id");
		return repository.save(municipio);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}
	
	public Municipio findByNomeAndEstado(String nome, String sigla) {
		Estado estado = estadoService.find(sigla);
		Optional<Municipio> optional = repository.findByNomeAndEstado(nome.toUpperCase(), estado);
		if (!optional.isPresent()) {
			throw new EntidadeNaoEncontrada("Município não encontrado");
		}
		return optional.get();
	}

}
