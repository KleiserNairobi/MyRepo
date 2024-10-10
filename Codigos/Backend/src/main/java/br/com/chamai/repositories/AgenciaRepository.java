package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.Agencia;
import br.com.chamai.models.Banco;
import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.queries.AgenciaRepositoryQuery;

public interface AgenciaRepository extends JpaRepository<Agencia, Long>, AgenciaRepositoryQuery {

	@Query("SELECT a FROM Agencia a"
				+ " JOIN FETCH a.banco")
	List<Agencia> findAll();

	@Query("SELECT a FROM Agencia a"
				+ " INNER JOIN Conta c ON a.id = c.agencia"
				+ " WHERE c.pessoa = :pessoa")
	List<Agencia> findAllByPessoa(@Param("pessoa") Pessoa pessoa);

	@Query("SELECT a FROM Agencia a"
				+ " JOIN FETCH a.banco"
				+ " WHERE a.banco = :banco")
	List<Agencia> findByBanco(@Param("banco") Banco banco);

	@Query(" from Agencia where codigo = :codigo ")
	Optional<Agencia> findByCodigoAgencia(@Param("codigo") String codigo);

}
