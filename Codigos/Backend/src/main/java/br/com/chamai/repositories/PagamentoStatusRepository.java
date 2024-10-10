package br.com.chamai.repositories;

import br.com.chamai.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PagamentoStatusRepository extends JpaRepository<PagamentoStatus, PagamentoStatusPK> {

    @Query(" from PagamentoStatus ps where ps.pagamento = :pagamento ")
    List<PagamentoStatus> findByPagamento(@Param("pagamento") Pagamento pagamento);

    @Query(value = "select * from pagamento_status " +
            "where pagamento_id = :pagamento_id " +
            "order by id desc limit 1", nativeQuery = true)
    PagamentoStatus getUltimoID(@Param("pagamento_id") Long pagamento_id);

    @Query(value = "select * from pagamento_status ps " +
            "where pagamento_id = :idPagamento " +
            "order by id desc limit 1", nativeQuery = true)
    Optional<PagamentoStatus> getUltimoStatus(@Param("idPagamento") Long idPagamento);

}
