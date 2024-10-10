package br.com.chamai.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {
	
	@Query(value = "SELECT l.* FROM Localizacao l " +
			"INNER JOIN Pessoa p ON (l.pessoa_id = p.id) " +
			"INNER JOIN Veiculo v ON (v.pessoa_id = p.id) " +
			"WHERE l.disponivel = true " +
			"AND p.online = true " +
			"AND p.ativo = true " +
			"AND p.entregador = true " +
			"AND v.ativo = true " +
			"AND v.tipo = :tipo " +
			"AND haversine(:lat, :lng, latitude, longitude) <= :distanciaMaxima " +
			"ORDER BY haversine(:lat, :lng, latitude, longitude) " +
			"LIMIT 5", nativeQuery = true)
	List<Localizacao> listEntregadoresByLatitudeLongitude(
			@Param("lat") BigDecimal lat,
			@Param("lng") BigDecimal lng,
			@Param("tipo") String tipo,
			@Param("distanciaMaxima") BigDecimal distanciaMaxima
	);
	
	@Query(value = "SELECT 			l.*"
							 + "FROM 				Localizacao l "
							 + "INNER JOIN  Pessoa p ON l.pessoa_id = p.id "
							 + "INNER JOIN  Veiculo v ON v.pessoa_id = p.id "
							 + "WHERE "
							 + "						l.pessoa_id = :entregador"
							 + "						AND l.disponivel = true "
							 + "						AND p.online = true "
							 + "						AND p.ativo = true "
							 + "						AND p.entregador = true "
							 + "						AND v.ativo = true "
							 + "						LIMIT 1", nativeQuery = true)
	Optional<Localizacao> localizacaoEntregadorDisponivel(@Param("entregador") long idEntregador);
	
	@Query(value = "select * from Localizacao where pessoa_id = :entregador", nativeQuery = true)
	Optional<Localizacao> findByEntregador(@Param("entregador") long entregador);

	@Modifying
	@Transactional(readOnly = false)
	@Query(value = "update Localizacao " +
			"set disponivel = :isDisponivel " +
			"where pessoa = :pessoa " +
			"and data = CURRENT_DATE " +
			"and hora = CURRENT_TIME")
	void updateDisponivelByPessoa(
			@Param("pessoa") Pessoa pessoa,
			@Param("isDisponivel") boolean isDisponivel
	);
	
}