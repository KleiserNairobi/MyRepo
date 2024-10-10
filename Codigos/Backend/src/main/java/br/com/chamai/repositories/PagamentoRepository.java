package br.com.chamai.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.Agendamento;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.EstatisticaPagamento;
import br.com.chamai.models.Pagamento;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    @Query(" from Pagamento p " +
            "left join fetch p.agendamento a " +
            "left join fetch p.entrega e " +
            "left join fetch p.gateway g " +
            "join fetch p.tabelaPreco tp " +
            "left join fetch p.desconto d " +
            "left join fetch a.cliente " +
            "left join fetch a.entregador " +
            "left join fetch e.cliente " +
            "left join fetch e.entregador " +
            "left join fetch e.agendamento ")
    List<Pagamento> findAll();
    
    @Query("SELECT p FROM Pagamento p"
    		+ " LEFT JOIN FETCH p.agendamento a"
    		+ " LEFT JOIN FETCH p.entrega e"
    		+ " LEFT JOIN FETCH p.gateway g"
    		+ " JOIN FETCH p.tabelaPreco tp"
    		+ " LEFT JOIN FETCH p.desconto d"
    		+ " LEFT JOIN FETCH a.cliente"
    		+ " LEFT JOIN FETCH a.entregador"
    		+ " LEFT JOIN FETCH e.cliente"
    		+ " LEFT JOIN FETCH e.entregador"
    		+ " LEFT JOIN FETCH e.agendamento "
  			+ " WHERE p.entrega = :entrega")
    Optional<Pagamento> findByEntrega(@Param("entrega") Entrega entrega);
    
    @Query("SELECT p FROM Pagamento p"
    		+ " LEFT JOIN FETCH p.agendamento a"
    		+ " LEFT JOIN FETCH p.entrega e"
    		+ " LEFT JOIN FETCH p.gateway g"
    		+ " JOIN FETCH p.tabelaPreco tp"
    		+ " LEFT JOIN FETCH p.desconto d"
    		+ " LEFT JOIN FETCH a.cliente"
    		+ " LEFT JOIN FETCH a.entregador"
    		+ " LEFT JOIN FETCH e.cliente"
    		+ " LEFT JOIN FETCH e.entregador"
    		+ " LEFT JOIN FETCH e.agendamento "
    		+ " WHERE p.agendamento = :agendamento")
    Optional<Pagamento> findByAgendamento(@Param("agendamento") Agendamento agendamento);
    
    @Modifying
  	@Transactional(readOnly = false)
  	@Query(value = "UPDATE Pagamento SET entrega = :entrega WHERE agendamento = :agendamento")
  	void insertEntregaPorAgendamento(
  			@Param("entrega") Entrega entrega,
  			@Param("agendamento") Agendamento agendamento
  	);
    
    @Query(value = "SELECT COALESCE(SUM(CASE WHEN ps.status = 'I' THEN p.total END), 0.0) AS total, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'N' THEN p.total END), 0.0) AS negado, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'A' THEN p.total END), 0.0) AS autorizado, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'E' THEN p.total END), 0.0) AS efetuado, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'NRE' THEN p.total END), 0.0) AS naoRealizado, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'TCP' THEN p.total END), 0.0) AS taxaCancelamentoPendente, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'TCC' THEN p.total END), 0.0) AS taxaCancelamentoConcluida, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'DEV' THEN p.total END), 0.0) AS devolvido, " +
					"  	COALESCE(SUM(CASE WHEN ps.status = 'EST' THEN p.total END), 0.0) AS estornado, " +
					"  	COALESCE(SUM(CASE WHEN p.tipo_pgto = 'D' THEN p.total END), 0.0) AS dinheiro, " +
					"  	COALESCE(SUM(CASE WHEN p.tipo_pgto = 'CC' THEN p.total END), 0.0) AS cartaoCredito, " +
					"  	COALESCE(SUM(CASE WHEN p.tipo_pgto = 'CD' THEN p.total END), 0.0) AS cartaoDebito " +
					" FROM pagamento p " +
					" INNER JOIN pagamento_status ps ON p.id = ps.pagamento_id " +
					" WHERE ps.data BETWEEN :dataInicial AND :dataFinal", nativeQuery = true)
	Optional<EstatisticaPagamento> getEstatisticaPorPeriodo(
			@Param("dataInicial") LocalDate dataInicial,
			@Param("dataFinal") LocalDate dataFinal
	);

}
