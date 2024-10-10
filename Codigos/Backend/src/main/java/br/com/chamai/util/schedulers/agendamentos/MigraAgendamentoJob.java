package br.com.chamai.util.schedulers.agendamentos;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;

import br.com.chamai.configs.ApplicationContextHolder;
import br.com.chamai.models.Agendamento;
import br.com.chamai.models.AgendamentoEndereco;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.dto.EntregaDto;
import br.com.chamai.models.dto.EntregaEnderecoDto;
import br.com.chamai.repositories.AgendamentoEnderecoRepository;
import br.com.chamai.repositories.AgendamentoRepository;
import br.com.chamai.repositories.EntregaRepository;
import br.com.chamai.repositories.PagamentoRepository;
import br.com.chamai.services.EntregaService;

/**
 * Classe responsável por migrar os agendamentos Dados da tabela AGENDAMENTO vai
 * para a tabela ENTREGA Dados da tabela AGENDAMENTO_ENDERECO vai para a tabela
 * ENTREGA_ENDERECO
 */
public class MigraAgendamentoJob implements Job {

	ApplicationContext instance = ApplicationContextHolder.getInstance();
	EntregaService entregaService = instance.getBean(EntregaService.class);
	EntregaRepository entregaRepository = instance.getBean(EntregaRepository.class);
	AgendamentoRepository agendamentoRepository = instance.getBean(AgendamentoRepository.class);
	AgendamentoEnderecoRepository agendamentoEnderecoRepository = instance.getBean(AgendamentoEnderecoRepository.class);
	PagamentoRepository pagamentoRepository = instance.getBean(PagamentoRepository.class);

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		Calendar calendar = Calendar.getInstance();
		
		calendar.add(Calendar.MINUTE, 15);
		calendar.set(Calendar.SECOND, 0);
		
		LocalDate dataAtual = new Date(calendar.getTime().getTime()).toLocalDate();
		Time time = Time.valueOf(LocalTime.of(calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), 0));
		System.out.println("Migrar agendamentos para entrega em => " + time);
		
		agendamentoRepository.findMigration(dataAtual, time)
			.stream()
			.filter((Agendamento obj) -> {
				return !jaMigrado(obj.getId());
			}).forEach((Agendamento obj) -> {
				migraAgendamento(dataAtual, obj);
			});
	}

	private void migraAgendamento(LocalDate dataAtual, Agendamento agendamento) {
		List<EntregaEnderecoDto> listaEnderecos = agendamentoEnderecoRepository.findByAgendamento(agendamento)
				.stream()
				.map((AgendamentoEndereco endereco) -> {
					EntregaEnderecoDto enderecoDto = new EntregaEnderecoDto();
					BeanUtils.copyProperties(endereco, enderecoDto, "id");
					return enderecoDto;
				}).collect(Collectors.toList());

		if (listaEnderecos.isEmpty()) {
			System.out.println("Não existem endereços cadastrados para este agendamento de id " + agendamento.getId());
			return;
		}

		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Time horaExecucao = Time.valueOf(LocalTime.of(calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), 0, 0));
		
		EntregaDto entregaDto = EntregaDto.builder()
				.agendamento(agendamento.getId())
				.cliente(agendamento.getCliente().getId())
				.tipoVeiculo(agendamento.getTipoVeiculo())
				.data(dataAtual)
				.deslocamento(agendamento.getDeslocamento())
				.distancia(agendamento.getDistancia())
				.previsao(agendamento.getPrevisao())
				.horaExecucao(agendamento.getHoraExecucao())
				.horaMigracao(horaExecucao)
				.entregadorPreferencial(agendamento.getEntregador() != null ? agendamento.getEntregador().getId() : null)
				.listaEnderecos(listaEnderecos)
			.build();
		Entrega entrega = entregaService.insert(entregaDto);
		
		inserirEntregaEmPagamentoPorAgendamento(entrega, agendamento);

		agendamentoRepository.updateRealizadoById(agendamento.getId(), true);
	}
	
	private void inserirEntregaEmPagamentoPorAgendamento(Entrega entrega, Agendamento agendamento) {
		pagamentoRepository.insertEntregaPorAgendamento(entrega, agendamento);
	}

	private boolean jaMigrado(long idAgendamento) {
		return entregaRepository.isAgendamentoMigrado(idAgendamento).orElse(false);
	}

}