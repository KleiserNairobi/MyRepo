package br.com.chamai.services;

import java.time.LocalDate;
import br.com.chamai.models.*;
import br.com.chamai.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstatisticaService {
	
	@Autowired AgendamentoRepository agendamentoRepository;
	@Autowired EntregaRepository entregaRepository;
	@Autowired PagamentoRepository pagamentoRepository;
	@Autowired PessoaRepository pessoaRepository;
	
	public EstatisticaAgendamento getAgendamentoPorPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
		return agendamentoRepository.getEstatisticaPorPeriodo(dataInicial, dataFinal).orElse(null);
	}
	
	public EstatisticaEntrega getEntregaPorPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
		return entregaRepository.getEstatisticaPorPeriodo(dataInicial, dataFinal).orElse(null);
	}
	
	public EstatisticaPagamento getPagamentoPorPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
		return pagamentoRepository.getEstatisticaPorPeriodo(dataInicial, dataFinal).orElse(null);
	}

	public EstatisticaEntregador getEntregadorByMunicipio(Long idMunicipio) {
		return pessoaRepository.getEstatiscaEntregadorByMunicipio(idMunicipio).orElse(null);
	}

}
