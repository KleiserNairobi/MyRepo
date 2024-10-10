package br.com.chamai.repositories;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.Agendamento;
import br.com.chamai.models.EstatisticaAgendamento;
import br.com.chamai.models.Pessoa;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a"
    			+ " JOIN FETCH a.cliente"
    			+ " LEFT JOIN FETCH a.entregador")
    List<Agendamento> findAll();
    
    @Query("SELECT a FROM Agendamento a"
    			+ " JOIN FETCH a.cliente"
    			+ " LEFT JOIN FETCH a.entregador"
    			+ " WHERE a.cliente = :cliente")
    List<Agendamento> findAllByCliente(@Param("cliente") Pessoa pessoa);
    
    @Query("SELECT a FROM Agendamento a"
    		+ " JOIN FETCH a.cliente"
    		+ " LEFT JOIN FETCH a.entregador"
    		+ " WHERE a.entregador = :entregador")
    List<Agendamento> findAllByEntregador(@Param("entregador") Pessoa pessoa);

    @Query("SELECT a FROM Agendamento a "
    			+ "JOIN FETCH a.cliente "
    			+ "LEFT JOIN FETCH a.entregador "
    			+ "WHERE a.dataExecucao = :data "
    			+ "		   AND a.horaExecucao = :hora "
    			+ " 		 AND a.ativo = true "
    			+ "			 AND a.realizado = false")
    List<Agendamento> findMigration(
            @Param("data") LocalDate data,
            @Param("hora") Time hora
    );

    @Transactional(readOnly = false)
    @Modifying
    @Query("UPDATE Agendamento SET realizado = :isRealizado WHERE id = :id")
    void updateRealizadoById(@Param("id") Long id, @Param("isRealizado") boolean isRealizado);
    
    @Transactional(readOnly = false)
    @Modifying
    @Query("UPDATE Agendamento SET entregador = :entregador WHERE id = :id")
    void updateEntregadorById(@Param("id") Long id, @Param("entregador") Pessoa entregador);

    @Transactional(readOnly = false)
    @Modifying
    @Query("update Agendamento " +
            "set ativo = false " +
            "where (id = :id or idOrigem = :id) " +
            "and realizado = false " +
            "and dataExecucao >= CURRENT_DATE ")
    void cancelaNaoRealizadosById(@Param("id") Long id);

    @Query(value =
            "select " +
            "   (p.total / (select count(*) " +
            "   from agendamento " +
            "   where id = :id or id_origem = :id)) * " +
            "   (select count(*) " +
            "   from agendamento " +
            "   where (id = :id or id_origem = :id) " +
            "   and realizado = false " +
            "   and data_execucao >= CURRENT_DATE) " +
            "from pagamento p " +
            "where p.agendamento_id = :id", nativeQuery = true)
    Float getValorDevolverTodos(@Param("id") Long id);

    @Query(value =
            "select (p.total / (select count(*) from agendamento where id = :id or id_origem = :id)) " +
            "from pagamento p " +
            "where p.agendamento_id = :id", nativeQuery = true)
    Float getValorDevolverUnico(@Param("id") Long id);
    
    @Query(value = " SELECT  COUNT(a.id) AS total, " +
                    " COUNT(CASE WHEN a.realizado = true THEN a.id END) AS realizado, " +
					" COUNT(CASE WHEN a.realizado = false THEN a.id END) AS naoRealizado, " +
					" COUNT(CASE WHEN a.ativo = false THEN a.id END) AS cancelado " +
					" FROM agendamento a " +
					" WHERE a.data_execucao BETWEEN :dataInicial AND :dataFinal", nativeQuery = true)
    Optional<EstatisticaAgendamento> getEstatisticaPorPeriodo(
				@Param("dataInicial") LocalDate dataInicial,
                @Param("dataFinal") LocalDate dataFinal
    );

}
