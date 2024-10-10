package br.com.chamai.services;

import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Gateway;
import br.com.chamai.repositories.GatewayRepository;

@Service
public class GatewayService {
	
	@Autowired GatewayRepository repository;
	
	public List<Gateway> findAll() {
		return repository.findAll();
	}

	public List<Gateway> findByAtivo(Boolean ativo) {
		return repository.findByAtivo(ativo);
	}

	public Gateway find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de gateway com o id " + id)
		);
	}

	@Transactional
	public Gateway insert(Gateway entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		entity.setNome(entity.getNome().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Gateway update(Gateway entity, Long id) {
		Gateway gateway = find(id);
		BeanUtils.copyProperties(entity, gateway, "id");
		gateway.setNome(entity.getNome().toUpperCase());
		return repository.save(gateway);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
