package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.chamai.models.ContaReceber;
import br.com.chamai.models.ParcelaContaReceber;
import br.com.chamai.models.ParcelaContaReceberPK;

public interface ParcelaContaReceberRepository extends JpaRepository<ParcelaContaReceber, ParcelaContaReceberPK> {

    @Query(" from ParcelaContaReceber pr " +
            "join pr.contaReceber r " +
            "join r.pessoa " +
            "join r.categoria " +
            "join r.moeda " +
            "where (pr.valorRecebimento = null) or (pr.valorRecebimento < pr.valor) " +
            "order by pr.dataRecebimento, pr.contaReceber, pr.id  ")
    List<ParcelaContaReceber> findAll();

    @Query(" from ParcelaContaReceber pr where pr.contaReceber = :contaReceber ")
    List<ParcelaContaReceber> findByReceber(@Param("contaReceber") ContaReceber contaReceber);

    @Query(value = "select * from parcela_receber where receber_id = :idContaReceber order by id desc limit 1", nativeQuery = true)
    ParcelaContaReceber getUltimoID(@Param("idContaReceber") Long idContaReceber);

    @Query("SELECT SUM(pcr.valorRecebimento) FROM ParcelaContaReceber pcr"
    		+ " WHERE pcr.contaReceber = :conta")
    Optional<Double> somarRecebimentosByConta(@Param("conta") ContaReceber conta);
    
}
