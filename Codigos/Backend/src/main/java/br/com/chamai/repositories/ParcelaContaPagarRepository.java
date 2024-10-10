package br.com.chamai.repositories;

import br.com.chamai.models.ContaPagar;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.ParcelaContaPagar;
import br.com.chamai.models.ParcelaContaPagarPK;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ParcelaContaPagarRepository extends JpaRepository<ParcelaContaPagar, ParcelaContaPagarPK> {

    @Query(" from ParcelaContaPagar pp " +
            "join fetch pp.contaPagar p " +
            "join fetch p.pessoa " +
            "join fetch p.categoria " +
            "join fetch p.moeda " +
            "where (pp.valorPagamento = null) or (pp.valorPagamento < pp.valor) " +
            "order by pp.dataVencimento, pp.contaPagar, pp.id ")
    List<ParcelaContaPagar> findAll();

    @Query(" from ParcelaContaPagar pp where pp.contaPagar = :contaPagar ")
    List<ParcelaContaPagar> findByPagar(@Param("contaPagar") ContaPagar contaPagar);

    @Query(value = "select * from parcela_pagar where pagar_id = :idContaPagar order by id desc limit 1", nativeQuery = true)
    ParcelaContaPagar getUltimoID(@Param("idContaPagar") Long idContaPagar);

    @Query("SELECT SUM(pcp.valorPagamento) FROM ParcelaContaPagar pcp"
    		+ " WHERE pcp.contaPagar = :conta")
    Optional<Double> somarPagamentosByConta(@Param("conta") ContaPagar conta);

}
