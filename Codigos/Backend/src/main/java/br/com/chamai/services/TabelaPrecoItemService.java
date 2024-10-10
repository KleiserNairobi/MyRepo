package br.com.chamai.services;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.TabelaPrecoItem;
import br.com.chamai.repositories.TabelaPrecoItemRepository;

@Service
public class TabelaPrecoItemService {
	
	@Autowired private TabelaPrecoItemRepository repository;
	
	public List<TabelaPrecoItem> findAll() {
		return repository.findAll();
	}
	
	public TabelaPrecoItem find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de tabela de item de preço com o id " + id)
		);
	}

	@Transactional
	public TabelaPrecoItem insert(TabelaPrecoItem entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		return repository.save(entity);
	}

	@Transactional
	public TabelaPrecoItem update(TabelaPrecoItem entity, Long id) {
		TabelaPrecoItem tabelaPreco = find(id);
		BeanUtils.copyProperties(entity, tabelaPreco, "id");
		return repository.save(tabelaPreco);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
