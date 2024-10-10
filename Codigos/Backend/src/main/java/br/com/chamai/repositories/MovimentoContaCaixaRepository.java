package br.com.chamai.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.chamai.models.MovimentoContaCaixa;

public interface MovimentoContaCaixaRepository extends JpaRepository<MovimentoContaCaixa, Long> {

    @Query("from MovimentoContaCaixa mcc join fetch mcc.contaCaixa")
    List<MovimentoContaCaixa> findAll();
    
    @Query("SELECT SUM(mcc.valor) FROM MovimentoContaCaixa mcc WHERE mcc.operacao = 'D' AND mcc.data BETWEEN :inicio AND :fim")
    Optional<Double> somarPagamentosByPeriodo(@Param("inicio") LocalDate dataInicial, @Param("fim") LocalDate dataFim);
    
    @Query("SELECT SUM(mcc.valor) FROM MovimentoContaCaixa mcc WHERE mcc.operacao = 'C' AND mcc.data BETWEEN :inicio AND :fim")
    Optional<Double> somarRecebimentosByPeriodo(@Param("inicio") LocalDate dataInicial, @Param("fim") LocalDate dataFim);

}
