package br.com.chamai.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import br.com.chamai.models.Endereco;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Conta;
import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.ContaRepository;
import br.com.chamai.util.UtilMethods;

@Service
public class ContaService {
	
	@Autowired private ContaRepository repository;
	@Autowired private AgenciaService agenciaService;
	@Autowired private PessoaService pessoaService;
	
	public List<Conta> findAll() {
		Pessoa pessoa = new UtilMethods().getPessoaFromUsuarioLogado();
		if (PessoaService.isCliente(pessoa)
				|| PessoaService.isParceiro(pessoa)
				|| PessoaService.isEntregador(pessoa)) {
			return repository.findAllByPessoa(pessoa);
		}
		if (PessoaService.isColaborador(pessoa)) {
			return repository.findAll();
		}
		return new ArrayList<>();
	}
	
	public Conta find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de conta com o id " + id)
		);
	}

	public Conta findAtivoByPessoa(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		Optional<Conta> conta = repository.findAtivoByPessoa(pessoa);
		if (!conta.isPresent()) {
			throw new EntidadeNaoEncontrada("Nenhuma conta registrada para o membro " + idPessoa);
		}
		return conta.get();
	}

	@Transactional
	public Conta insert(Conta entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		agenciaService.find(entity.getAgencia().getId());
		entity.setAtivo(true);
		return repository.save(entity);
	}

	@Transactional
	public Conta update(Conta entity, Long id) {
		Conta conta = find(id);
		BeanUtils.copyProperties(entity, conta, "id");
		return repository.save(conta);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
