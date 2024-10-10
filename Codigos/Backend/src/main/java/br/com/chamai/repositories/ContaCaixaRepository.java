package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.ContaCaixa;

public interface ContaCaixaRepository extends JpaRepository<ContaCaixa, Long> {

    @Query("from ContaCaixa cc join fetch cc.conta c join fetch c.agencia a join fetch c.pessoa join fetch a.banco")
    List<ContaCaixa> findAll();
    
    @Query(value = "SELECT cc.* FROM conta_caixa cc WHERE cc.tipo = :tipo AND cc.referencia = :ref LIMIT 1", nativeQuery = true)
    Optional<ContaCaixa> caixaByReferenciaTipo(@Param("ref") String referencia, @Param("tipo") String tipo);
    
    @Query(value = "SELECT cc.* FROM conta_caixa cc WHERE cc.tipo = :tipo AND cc.referencia < :ref ORDER BY cc.referencia DESC LIMIT 1", nativeQuery = true)
    Optional<ContaCaixa> caixaInternoByReferenciaAnterior(@Param("ref") String referencia, @Param("tipo") String tipo);

    @Transactional(readOnly = false)
    @Modifying
    @Query(value = "UPDATE conta_caixa SET movimento_pagamento ="
    		+ " (SELECT SUM(valor) FROM movimento_conta_caixa WHERE operacao = 'D' AND CONCAT_WS('/', Extract('Year' From data), LPAD(CAST(Extract('Month' From data) AS VARCHAR), 2, '0')) = :ref)"
    		+ " WHERE referencia = :ref", nativeQuery = true)
    void atualizarCaixaPagamentosByReferencia(@Param("ref") String referencia);
    
    @Transactional(readOnly = false)
    @Modifying
    @Query(value = "UPDATE conta_caixa SET movimento_pagamento ="
    		+ " (SELECT SUM(valor) FROM movimento_conta_caixa WHERE operacao = 'C' AND CONCAT_WS('/', Extract('Year' From data), LPAD(CAST(Extract('Month' From data) AS VARCHAR), 2, '0')) = :ref)"
    		+ " WHERE referencia = :ref", nativeQuery = true)
    void atualizarCaixaRecebimentos(@Param("ref") String referencia);
    
}
