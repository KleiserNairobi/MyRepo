package br.com.chamai.util.schedulers.agendamentos;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.stereotype.Service;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;

/**
 * Classe responsável por configurar o agendador
 * que irá migrar os agendamentos para entrega.
 * Agendador configurado para executar de minuto em minuto
 */
@Service
public class MigraAgendamentoSheduler {

	private static Scheduler scheduler = null;

    public void inicia() {
		if (scheduler != null) {
			throw new ExcecaoTempoExecucao("Agendamento já iniciado");
		}
		try {
			JobDetail job = JobBuilder.newJob(MigraAgendamentoJob.class)
					.withIdentity("migraAgendamentoJob", "group1")
					.build();

			SimpleScheduleBuilder simpleScheduleBuilder = SimpleScheduleBuilder
					.simpleSchedule()
					.withIntervalInMinutes(1)
					.repeatForever();

			Trigger trigger = TriggerBuilder
					.newTrigger()
					.withIdentity("migraAgendamentoTrigger", "group1")
					.withSchedule(simpleScheduleBuilder)
					//.withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
					.build();

			scheduler = new StdSchedulerFactory().getScheduler();
			scheduler.scheduleJob(job, trigger);
			scheduler.start();
		} catch (Exception e) {
		  System.out.println("ERRO!!!");
		  e.printStackTrace();
		}
    }
    
    public void pausar() throws SchedulerException {
    	if (scheduler == null) {
    		throw new ExcecaoTempoExecucao("Agendamento não iniciado");
    	}
    	if (scheduler.isInStandbyMode()) {
    		throw new ExcecaoTempoExecucao("Agendamento já está em pause");
    	}
    	try {
    		scheduler.standby();
    	} catch (Exception e) {
    		System.out.println("ERRO!!!");
    		e.printStackTrace();
    	}
    }
    
    public void reiniciar() throws SchedulerException {
    	if (scheduler == null) {
    		throw new ExcecaoTempoExecucao("Agendamento não iniciado");
    	}
    	if (!scheduler.isInStandbyMode()) {
    		throw new ExcecaoTempoExecucao("Agendamento não está em pause");
    	}
    	try {
	    	scheduler.start();
    	} catch (Exception e) {
    		System.out.println("ERRO!!!");
    		e.printStackTrace();
    	}
    }

}
