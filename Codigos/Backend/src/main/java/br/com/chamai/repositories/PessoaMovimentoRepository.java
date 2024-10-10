package br.com.chamai.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.Pessoa;
import br.com.chamai.models.PessoaMovimento;
import br.com.chamai.models.enums.OperacaoPessoaMovimento;

public interface PessoaMovimentoRepository extends JpaRepository<PessoaMovimento, Long> {
	
	@Query("SELECT pm FROM PessoaMovimento pm"
				+ " JOIN FETCH pm.pessoa"
				+ " WHERE pm.quitado = false"
				+ "		AND pm.pessoa = :pessoa"
				+ " 	AND pm.documento = :documento"
				+ "		AND pm.operacao = :operacao")
	Optional<PessoaMovimento> findByPessoaAndDocumentoAndOperacao(
				@Param("pessoa") Pessoa pessoa,
				@Param("documento") String documento,
				@Param("operacao") OperacaoPessoaMovimento operacao
		);
	
	@Transactional
	@Modifying
	@Query("UPDATE PessoaMovimento SET quitado = :isQuitado WHERE id = :id")
	void updateQuitadoById(@Param("id") long id, @Param("isQuitado") boolean isQuitado);
	
}
