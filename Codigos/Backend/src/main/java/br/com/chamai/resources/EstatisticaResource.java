package br.com.chamai.resources;

import java.time.LocalDate;

import br.com.chamai.models.EstatisticaEntregador;
import br.com.chamai.models.EstatisticaAgendamento;
import br.com.chamai.models.EstatisticaEntrega;
import br.com.chamai.models.EstatisticaPagamento;
import br.com.chamai.services.EstatisticaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/estatisticas")
@Api(value = "Estatísticas")
public class EstatisticaResource {

	@Autowired EstatisticaService service;

	@GetMapping("/entregadores/{idMunicipio}")
	@ApiOperation(value = "Retorna estatística acerca de entregadores de um município")
	public ResponseEntity<EstatisticaEntregador> getEntregador(@PathVariable Long idMunicipio) {
		return ResponseEntity.ok().body(service.getEntregadorByMunicipio(idMunicipio));
	}

	@GetMapping("/agendamento")
	@ApiOperation(value = "Retorna estatística de agendamentos por período")
	public ResponseEntity<EstatisticaAgendamento> getAgendamento(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataInicial,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataFinal) {
		return ResponseEntity.ok().body(service.getAgendamentoPorPeriodo(dataInicial, dataFinal));
	}
	
	@GetMapping("/entrega")
	@ApiOperation(value = "Retorna estatística de entregas por período")
	public ResponseEntity<EstatisticaEntrega> getEntrega(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataInicial,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataFinal) {
		return ResponseEntity.ok().body(service.getEntregaPorPeriodo(dataInicial, dataFinal));
	}
	
	@GetMapping("/pagamento")
	@ApiOperation(value = "Retorna estatística de pagamentos por período")
	public ResponseEntity<EstatisticaPagamento> getPagamento(
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataInicial,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataFinal) {
		return ResponseEntity.ok().body(service.getPagamentoPorPeriodo(dataInicial, dataFinal));
	}
	
}
