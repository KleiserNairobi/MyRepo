package br.com.chamai.repositories;

import br.com.chamai.models.Parametro;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParametroRepository extends JpaRepository<Parametro, Long> {

	@Query("SELECT p.distanciaMoto FROM Parametro p WHERE p.id = :id")
  Optional<BigDecimal> findDistanciaMotoById(@Param("id") long id);
	
	@Query("SELECT p.distanciaCarro FROM Parametro p WHERE p.id = :id")
	Optional<BigDecimal> findDistanciaCarroById(@Param("id") long id);
	
	@Query("SELECT p.distanciaBike FROM Parametro p WHERE p.id = :id")
	Optional<BigDecimal> findDistanciaBikeById(@Param("id") long id);
	
	@Query("SELECT p.distanciaCaminhao FROM Parametro p WHERE p.id = :id")
	Optional<BigDecimal> findDistanciaCaminhaoById(@Param("id") long id);
	
}
