package br.com.chamai.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.TabelaPreco;
import br.com.chamai.models.enums.TipoVeiculo;
import br.com.chamai.repositories.TabelaPrecoItemRepository;
import br.com.chamai.repositories.TabelaPrecoRepository;

@Service
public class TabelaPrecoService {
	
	@Autowired private TabelaPrecoRepository repository;
	@Autowired private TabelaPrecoItemRepository itemRepository;
	@Autowired private PessoaService pessoaService;
	
	public List<TabelaPreco> findAll() {
		return repository.findAll();
	}
	
	public TabelaPreco findTabelaPrecoDefaultByTipoVeiculo(TipoVeiculo tipoVeiculo) {
		Date data = new Date();
		Optional<TabelaPreco> optional = repository.findTabelaPrecoDefaultByTipoVeiculo(tipoVeiculo, data);
		
		if (!optional.isPresent()) {
			throw new ExcecaoTempoExecucao(
					"Não existe nenhuma tabela ativa cadastrada para o tipo de veículo " + tipoVeiculo.toString()
			);
		}

		return optional.get();
	}
	
	public TabelaPreco findTabelaPrecoByPessoaParceiroAndTipoVeiculo(Long pessoaId, TipoVeiculo tipoVeiculo) {
		Pessoa pessoa = pessoaService.find(pessoaId);
		Date data = new Date();
		Optional<TabelaPreco> optional = repository.findTabelaPrecoByPessoaParceiroAndTipoVeiculo(pessoa, tipoVeiculo, data);
		if (optional.isPresent()) {
			return optional.get();
		}
		return null;
	}
	
	public TabelaPreco find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de tabela de preço com o id " + id)
		);
	}

	@Transactional
	public TabelaPreco insert(TabelaPreco entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		entity.setDescricao(entity.getDescricao().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public TabelaPreco update(TabelaPreco entity, Long id) {
		TabelaPreco tabelaPreco = find(id);
		BeanUtils.copyProperties(entity, tabelaPreco, "id");
		tabelaPreco.setDescricao(tabelaPreco.getDescricao().toUpperCase());
		return repository.save(tabelaPreco);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}
	
	public void insertParceiroTabelaPreco(Long pessoaId, Long tabelaPrecoId) {
		TabelaPreco tabelaPreco = find(tabelaPrecoId);
		Pessoa pessoa = pessoaService.find(pessoaId);
		List<Pessoa> pessoas = new ArrayList<Pessoa>();
		pessoas.add(pessoa);
		tabelaPreco.setPessoas(pessoas);
		update(tabelaPreco, tabelaPrecoId);
	}	

}
