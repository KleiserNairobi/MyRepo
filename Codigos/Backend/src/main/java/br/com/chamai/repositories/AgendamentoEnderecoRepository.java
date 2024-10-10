package br.com.chamai.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.chamai.models.Agendamento;
import br.com.chamai.models.AgendamentoEndereco;

public interface AgendamentoEnderecoRepository extends JpaRepository<AgendamentoEndereco, Long> {

    @Query("SELECT ae FROM AgendamentoEndereco ae"
	    		+ " JOIN FETCH ae.agendamento"
	  			+ " LEFT JOIN FETCH ae.municipio"
    			+ " WHERE ae.agendamento = :agendamento")
    List<AgendamentoEndereco> findByAgendamento(@Param("agendamento") Agendamento agendamento);
    
}
