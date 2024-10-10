package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.Endereco;
import br.com.chamai.models.Pessoa;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

	@Query(" from Endereco e join e.pessoa join e.municipio order by e.pessoa.nome ")
	List<Endereco> findAll();

	@Query (value = "select e.* " +
			"from endereco e " +
			"join municipio m on (m.id = e.municipio_id) " +
			"where e.pessoa_id = :pessoa " +
			"and m.cobertura = :cobertura", nativeQuery = true)
	List<Endereco> findByPessoaAndCobertura(
			@Param("pessoa") long pessoa,
			@Param("cobertura") boolean cobertura
	);

	List<Endereco> findByPessoa(Pessoa pessoa);

	@Query("from Endereco e" +
			" join fetch e.pessoa p" +
			" join fetch e.municipio m" +
			" join fetch m.estado" +
			" where e.pessoa = :pessoa" +
			" and e.proprio = true")
	Optional<Endereco> findProprioByPessoa(@Param("pessoa") Pessoa pessoa);

	long countByPessoa(Pessoa pessoa);

	void deleteByPessoa(Pessoa pessoa);

}
