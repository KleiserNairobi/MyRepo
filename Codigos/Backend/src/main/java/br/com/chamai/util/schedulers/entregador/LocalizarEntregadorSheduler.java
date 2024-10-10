package br.com.chamai.util.schedulers.entregador;

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
 * Classe responsável por configurar o Localizar entregador
 * que irá migrar os agendamentos para entrega.
 * Agendador configurado para executar de minuto em minuto
 */
@Service
public class LocalizarEntregadorSheduler {

	private static Scheduler scheduler = null;

    public void inicia() {
		if (scheduler != null) {
			throw new ExcecaoTempoExecucao("Localizar entregador já iniciado");
		}
		try {
			JobDetail job = JobBuilder.newJob(LocalizarEntregadorJob.class)
					.withIdentity("localizarEntregadorJob", "group2")
					.build();

			SimpleScheduleBuilder simpleScheduleBuilder = SimpleScheduleBuilder
					.simpleSchedule()
					.withIntervalInMinutes(1)
					.repeatForever();

			Trigger trigger = TriggerBuilder
					.newTrigger()
					.withIdentity("localizarEntregadorTrigger", "group2")
					.withSchedule(simpleScheduleBuilder)
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
    		throw new ExcecaoTempoExecucao("Localizar entregador não iniciado");
    	}
    	if (scheduler.isInStandbyMode()) {
    		throw new ExcecaoTempoExecucao("Localizar entregador já está em pause");
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
    		throw new ExcecaoTempoExecucao("Localizar entregador não iniciado");
    	}
    	if (!scheduler.isInStandbyMode()) {
    		throw new ExcecaoTempoExecucao("Localizar entregador não está em pause");
    	}
    	try {
	    	scheduler.start();
    	} catch (Exception e) {
    		System.out.println("ERRO!!!");
    		e.printStackTrace();
    	}
    }

}
