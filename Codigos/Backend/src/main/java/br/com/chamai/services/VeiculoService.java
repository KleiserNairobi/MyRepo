package br.com.chamai.services;

import java.util.List;
import java.util.Optional;

import br.com.chamai.models.Pessoa;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Veiculo;
import br.com.chamai.repositories.VeiculoRepository;
import org.springframework.util.StringUtils;

@Service
public class VeiculoService {
	
	@Autowired private VeiculoRepository repository;
	@Autowired private PessoaService pessoaService;
	
	public List<Veiculo> findAll() {
		return repository.findAll();
	}
	
	public Veiculo find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de veículo com o id " + id)
		);
	}

	public List<Veiculo> findByPessoa(Pessoa pessoa) {
		return repository.findByPessoa(pessoa);
	}

	public Optional<Veiculo> findByPessoaAndAtivo(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		return repository.findByPessoaAndAtivo(pessoa, true);
	}

	@Transactional
	public Veiculo insert(Veiculo entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		entity.setModelo(entity.getModelo().toUpperCase());
		if (!StringUtils.isEmpty(entity.getRenavan())) {
			entity.setRenavan(entity.getRenavan().toUpperCase());
		}
		if (!StringUtils.isEmpty(entity.getPlaca())) {
			entity.setPlaca(entity.getPlaca().toUpperCase());
		}
		return repository.save(entity);
	}

	@Transactional
	public Veiculo update(Veiculo entity, Long id) {
		Veiculo veiculo = find(id);
		BeanUtils.copyProperties(entity, veiculo, "id");
		veiculo.setModelo(entity.getModelo().toUpperCase());
		if (!StringUtils.isEmpty(entity.getRenavan())) {
			veiculo.setRenavan(entity.getRenavan().toUpperCase());
		}
		if (!StringUtils.isEmpty(entity.getPlaca())) {
			veiculo.setPlaca(entity.getPlaca().toUpperCase());
		}
		return repository.save(veiculo);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	@Transactional
	public void updateAtivo(Long id, boolean isAtivo) {
		find(id);
		repository.updateAtivo(id, isAtivo);
	}

}
