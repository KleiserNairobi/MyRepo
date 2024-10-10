package br.com.chamai.repositories;

import br.com.chamai.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface EntregaStatusRepository extends JpaRepository<EntregaStatus, EntregaStatusPK> {

    @Query(" from EntregaStatus es " +
            "join fetch es.entrega e " +
            "join fetch e.cliente " +
            "left join fetch e.entregador " +
            "left join fetch e.agendamento ")
    List<EntregaStatus> findAll();

    @Query(" from EntregaStatus es where es.entrega = :entrega ")
    List<EntregaStatus> findByEntrega(@Param("entrega") Entrega entrega);

    @Query(value = "select * from entrega_status es " +
            "where entrega_id = :idEntrega " +
            "order by id desc limit 1", nativeQuery = true)
    Optional<EntregaStatus> getUltimoStatus(@Param("idEntrega") Long idEntrega);

    @Query(value = "select * from entrega_status " +
            "where entrega_id = :entrega_id " +
            "order by id desc limit 1", nativeQuery = true)
    EntregaStatus getUltimoID(@Param("entrega_id") Long entrega_id);

  	@Modifying
  	@Transactional(readOnly = false)
  	@Query("DELETE FROM EntregaStatus es WHERE es.entrega = :entrega")
  	void deleteByEntrega(@Param("entrega") Entrega entrega);

}
