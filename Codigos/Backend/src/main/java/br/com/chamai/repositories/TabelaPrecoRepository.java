package br.com.chamai.repositories;

import java.util.Date;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.TabelaPreco;
import br.com.chamai.models.enums.TipoVeiculo;

public interface TabelaPrecoRepository extends JpaRepository<TabelaPreco, Long> {
	
	@Query("SELECT tp FROM TabelaPreco tp"
			+ " WHERE tp.ativo = true"
			+ "	  AND (tp.validadeFim is null OR tp.validadeFim > :date)"
			+ "	  AND tp.padrao = true"
			+ "	  AND tp.tipoVeiculo = :tipoVeiculo")
	Optional<TabelaPreco> findTabelaPrecoDefaultByTipoVeiculo(
			@Param("tipoVeiculo") TipoVeiculo tipoVeiculo, @Param("date") Date date
	);
	
	@Query("SELECT tp FROM TabelaPreco tp"
			+ "  JOIN ParceiroTabelaPreco ptp ON ptp.tabelaPreco = tp.id"
			+ "  JOIN Pessoa p ON p.id = ptp.pessoa"
			+ " WHERE tp.ativo = true"
			+ "   AND tp.tipoVeiculo = :tipoVeiculo"
			+ "   AND (tp.validadeFim is null OR tp.validadeFim > :date)"
			+ "   AND p.parceiro = true"
			+ "   AND ptp.pessoa = :pessoa")
	Optional<TabelaPreco> findTabelaPrecoByPessoaParceiroAndTipoVeiculo(
			@Param("pessoa") Pessoa pessoa, @Param("tipoVeiculo") TipoVeiculo tipoVeiculo, @Param("date") Date date
	);
	
}
