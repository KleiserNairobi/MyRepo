package br.com.chamai.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.GatewayTaxa;
import br.com.chamai.repositories.GatewayTaxaRepository;

@Service
public class GatewayTaxaService {
	
	@Autowired private GatewayTaxaRepository repository;
	
	public List<GatewayTaxa> findAll() {
		return repository.findAll();
	}
	
	public GatewayTaxa find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de gateway taxa com o id " + id)
		);
	}

	public GatewayTaxa getTaxaEmVigor(Long id) {
		return repository.findTaxaEmVigor(id);
	}

	@Transactional
	public GatewayTaxa insert(GatewayTaxa entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getGateway() == null || entity.getGateway().getId() == null) {
			throw new EntidadeNaoEncontrada("Gateway taxa não informado");
		}
		return repository.save(entity);
	}

	@Transactional
	public GatewayTaxa update(GatewayTaxa entity, Long id) {
		GatewayTaxa gateway = find(id);
		BeanUtils.copyProperties(entity, gateway, "id");
		return repository.save(gateway);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
