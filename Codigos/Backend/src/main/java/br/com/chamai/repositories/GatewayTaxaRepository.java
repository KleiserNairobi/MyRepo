package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.GatewayTaxa;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GatewayTaxaRepository extends JpaRepository<GatewayTaxa, Long> {

    @Query(value = "select * from gateway_taxa where gateway_id = :id order by data desc limit 1", nativeQuery = true)
    GatewayTaxa findTaxaEmVigor(@Param("id") Long id);

}
