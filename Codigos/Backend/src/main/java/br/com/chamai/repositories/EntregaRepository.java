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

import br.com.chamai.models.Entrega;
import br.com.chamai.models.EstatisticaEntrega;
import br.com.chamai.models.Pessoa;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    @Query(" from Entrega e where e.id = :id ")
    Optional<Entrega> findById(@Param("id") Long id);

    @Query(" from Entrega e " +
            "join fetch e.cliente " +
            "left join fetch e.entregador " +
            "left join fetch e.agendamento " +
            "where e.cliente = :cliente " +
            "order by e.data desc, e.id desc")
    List<Entrega> getEntregasByPessoa(@Param("cliente") Pessoa pessoa);

    @Query(" from Entrega e " +
            "join fetch e.cliente " +
            "left join fetch e.entregador " +
            "left join fetch e.agendamento " +
            "where e.entregador = :entregador " +
            "order by e.data desc, e.id desc")
    List<Entrega> getEntregasByEntregador(@Param("entregador") Pessoa entregador);

    @Query("SELECT p FROM Entrega e"
    		+ " INNER JOIN Pessoa p ON e.entregador = p.id"
    		+ " WHERE e.id = :id")
    Optional<Pessoa> getEntregador(@Param("id") Long id);
    
    @Query(value = "SELECT COUNT(e.id) > 0 " +
            "FROM Entrega e " +
            "WHERE e.agendamento_id = :id", nativeQuery = true)
    Optional<Boolean> isAgendamentoMigrado(@Param("id") long idAgendamento);

    @Modifying
    @Transactional(readOnly = false)
    @Query("UPDATE Entrega SET entregador = :entregador WHERE id = :id")
    void updateEntregadorById(@Param("id") Long id, @Param("entregador") Pessoa entregador);
    // Este método está sendo usado na migração de agendamento

    @Query("SELECT e FROM Entrega e "
    			+ "JOIN FETCH e.cliente "
    			+ "LEFT JOIN FETCH e.entregador "
    			+ "LEFT JOIN FETCH e.agendamento "
    			+ "LEFT JOIN FETCH e.preferencia "
    			+ "WHERE "
    			+ "			 e.entregador IS NULL"
    			+ "			 AND e.agendamento IS NOT NULL"
    			+ "			 AND e.data = :data"
    			+ "			 AND :hora BETWEEN e.horaMigracao AND e.horaExecucao")
    List<Entrega> findMigration(@Param("data") LocalDate data, @Param("hora") Time hora);
    
    @Query(value = "SELECT COUNT(e.id) > 0 "
								 + "FROM entrega e "
				    		 + "WHERE e.entregador_id = :entregador", nativeQuery = true)
    Optional<Boolean> isEntregador(@Param("entregador") long entregador);

    @Query(value = " SELECT COUNT(DISTINCT(e.id)) AS total, " +
		    		" COUNT(CASE WHEN es.status = 'NI' THEN e.id END) AS naoIniciada, " +
					" COUNT(CASE WHEN es.status = 'CO' THEN e.id END) AS concluida, " +
					" COUNT(CASE WHEN es.status = 'CA' THEN e.id END) AS cancelada, " +
					" COUNT(CASE WHEN es.status = 'EDR' THEN e.id END) AS entregadorDeslocamentoRetirada, " +
					" COUNT(CASE WHEN es.status = 'ENE' THEN e.id END) AS entregadorNaoLocalizado " +
					" FROM entrega e " +
					" INNER JOIN entrega_status es ON e.id = es.entrega_id " +
					" WHERE e.data BETWEEN :dataInicial AND :dataFinal", nativeQuery = true)
	Optional<EstatisticaEntrega> getEstatisticaPorPeriodo(
			@Param("dataInicial") LocalDate dataInicial,
			@Param("dataFinal") LocalDate dataFinal
	);
    
}
