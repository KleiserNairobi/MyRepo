package br.com.chamai.events;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

public class EntregaFinalizadaEvent extends ApplicationEvent {

	private static final long serialVersionUID = 1L;
	
	@Getter
	private Long idEntrega;
	
	public EntregaFinalizadaEvent(Object source, Long idEntrega) {
		super(source);
		this.idEntrega = idEntrega;
	}

}
