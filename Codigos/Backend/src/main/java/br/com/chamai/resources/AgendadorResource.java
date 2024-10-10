package br.com.chamai.resources;

import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.chamai.util.schedulers.agendamentos.MigraAgendamentoSheduler;
import br.com.chamai.util.schedulers.entregador.LocalizarEntregadorSheduler;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/agendador")
@Api(value = "Agendador de tarefas")
public class AgendadorResource {
	
	@Autowired private MigraAgendamentoSheduler migraAgendamentoSheduler;
	@Autowired private LocalizarEntregadorSheduler localizarEntregadorSheduler;
	
	@GetMapping("/migra-agendamento-entrega/iniciar")
	@ApiOperation(value = "Inicia migração de agendamentos")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void iniciarMigraAgendamento() throws SchedulerException {
		migraAgendamentoSheduler.inicia();
	}
	
	@GetMapping("/migra-agendamento-entrega/pausar")
	@ApiOperation(value = "Pausa migração de agendamentos")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void pausarMigraAgendamento() throws SchedulerException {
		migraAgendamentoSheduler.pausar();
	}
	
	@GetMapping("/migra-agendamento-entrega/reiniciar")
	@ApiOperation(value = "Reinicia migração de agendamentos")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void reiniciarMigraAgendamento() throws SchedulerException {
		migraAgendamentoSheduler.reiniciar();
	}
	
	@GetMapping("/localizar-entregador/iniciar")
	@ApiOperation(value = "Inicia localizar entregador")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void iniciarLocalizarEntregador() throws SchedulerException {
		localizarEntregadorSheduler.inicia();
	}
	
	@GetMapping("/localizar-entregador/pausar")
	@ApiOperation(value = "Pausa localizar entregador")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void pausarLocalizarEntregador() throws SchedulerException {
		localizarEntregadorSheduler.pausar();
	}
	
	@GetMapping("/localizar-entregador/reiniciar")
	@ApiOperation(value = "Reinicia localizar entregador")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void reiniciarLocalizarEntregador() throws SchedulerException {
		localizarEntregadorSheduler.reiniciar();
	}
	
}
