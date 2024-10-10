package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.Conta;
import br.com.chamai.models.Pessoa;

public interface ContaRepository extends JpaRepository<Conta, Long> {

	@Query("SELECT c FROM Conta c"
			+ " JOIN FETCH c.pessoa p"
			+ " JOIN FETCH c.agencia a"
			+ " JOIN FETCH a.banco b"
			+ " order by p.nome, b.nome "
	)
	List<Conta> findAll();

	@Query("SELECT c FROM Conta c"
			+ " JOIN FETCH c.pessoa"
			+ " JOIN FETCH c.agencia a"
			+ " JOIN FETCH a.banco"
			+ " WHERE c.pessoa = :pessoa")
	List<Conta> findAllByPessoa(@Param("pessoa") Pessoa pessoa);

	@Query("from Conta c" +
			" join fetch c.pessoa" +
			" join fetch c.agencia a" +
			" join fetch a.banco" +
			" where c.pessoa = :pessoa" +
			" and c.ativo = true ")
	Optional<Conta> findAtivoByPessoa(@Param("pessoa") Pessoa pessoa);

}
