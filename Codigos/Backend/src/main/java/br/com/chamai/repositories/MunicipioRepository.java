package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.Estado;
import br.com.chamai.models.Municipio;
import br.com.chamai.repositories.queries.MunicipioRepositoryQuery;

public interface MunicipioRepository extends JpaRepository<Municipio, Long>, MunicipioRepositoryQuery {

	@Query(" from Municipio m where m.estado = :estado order by m.estado, m.nome ")
	List<Municipio> findByEstado(@Param("estado") Estado estado);

	Optional<Municipio> findByNomeAndEstado(String nome, Estado estado);
	
	@Query("SELECT COUNT(m.id) > 0 FROM Municipio m WHERE m.cobertura = true AND m.estado = :estado AND m.nome = :nome")
	Boolean isMunicipioComCobertura(@Param("nome") String nome, @Param("estado") Estado estado);
	
}
