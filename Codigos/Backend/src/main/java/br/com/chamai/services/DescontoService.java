package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Desconto;
import br.com.chamai.models.PessoaDesconto;
import br.com.chamai.repositories.DescontoRepository;
import br.com.chamai.repositories.PessoaDescontoRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DescontoService {
	
	@Autowired private DescontoRepository repository;
	@Autowired private PessoaDescontoRepository pessoaDescontoRepository;
	
	public List<Desconto> findAll() {
		return repository.findAll();
	}
	
	public Desconto find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de desconto com o id " + id)
		);
	}

	public Optional<Desconto> findByCodigo(Long idPessoa, String codCupom) {
		Optional<Desconto> desconto = repository.findByCodigo(codCupom.toUpperCase());

		if (desconto.isEmpty()) {
			throw new EntidadeNaoEncontrada(
					"Não existe um cadastro de desconto com o código " + codCupom.toUpperCase()
			);
		}

		Optional<PessoaDesconto> pessoaDesconto =
				pessoaDescontoRepository.findByPessoaAndDesconto(idPessoa,desconto.get().getId());

		if (!pessoaDesconto.isEmpty()) {
			throw new ExcecaoTempoExecucao(
					"O cupom " + codCupom.toUpperCase() + " já foi utilizado pela pessoa " + idPessoa
			);
		}

		if (desconto.get().getValidadeFim().isBefore(LocalDate.now())) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
			throw new ExcecaoTempoExecucao(
					"A validade do cupom " + codCupom.toUpperCase() +
							" venceu em " + desconto.get().getValidadeFim().format(formatter)
			);
		}

		return desconto;
	}

	@Transactional
	public Desconto insert(Desconto entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao(
					"Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
			);
		}
		entity.setCodigo(entity.getCodigo().toUpperCase());
		entity.setDescricao(entity.getDescricao().toUpperCase());
		return repository.save(entity);
	}

	@Transactional
	public Desconto update(Desconto entity, Long id) {
		Desconto desconto = find(id);
		BeanUtils.copyProperties(entity, desconto, "id");
		desconto.setCodigo(entity.getCodigo().toUpperCase());
		desconto.setDescricao(entity.getDescricao().toUpperCase());
		return repository.save(desconto);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

}
