package br.com.chamai.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Agencia;
import br.com.chamai.models.Banco;
import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.AgenciaRepository;
import br.com.chamai.repositories.filters.AgenciaFilter;
import br.com.chamai.util.UtilMethods;

@Service
public class AgenciaService {
	
	@Autowired private AgenciaRepository repository;
	@Autowired private BancoService bancoService;
	
	public List<Agencia> findAll() {
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
	
	public Page<Agencia> findPage(AgenciaFilter filter, Pageable pageable) {
		return repository.filtrar(filter, pageable);
	}
	
	public Agencia find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de agência com o id " + id)
		);
	}
	
	public List<Agencia> listByBanco(Long idBanco) {
		Banco banco = bancoService.find(idBanco);		
		return repository.findByBanco(banco);
	}

	public Agencia findByCodigoAgencia(String codigo) {
		Optional<Agencia> agencia = repository.findByCodigoAgencia(codigo);
		if (!agencia.isPresent()) {
			throw new ExcecaoTempoExecucao("Não existe registro de agência com o código " + codigo);
		}
		return agencia.get();
	}

	@Transactional
	public Agencia insert(Agencia entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getBanco() == null || entity.getBanco().getId() == null) {
			throw new EntidadeNaoEncontrada("Banco não informado");
		}
		bancoService.find(entity.getBanco().getId());
		entity.setCodigo(entity.getCodigo().toUpperCase());
		entity.setNome(entity.getNome().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Agencia update(Agencia entity, Long id) {
		Agencia agencia = find(id);
		agencia.setCodigo(entity.getCodigo().toUpperCase());
		agencia.setBanco(entity.getBanco());
		agencia.setNome(entity.getNome().toUpperCase());
		return repository.save(agencia);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
