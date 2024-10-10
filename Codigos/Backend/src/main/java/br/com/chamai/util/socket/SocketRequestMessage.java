package br.com.chamai.util.socket;

import br.com.chamai.util.socket.enums.SocketAssunto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter @Setter
public class SocketRequestMessage {
	
	private SocketAssunto assunto;
	private Long idEntrega;
	private Long idAgendamento;
	private Long sender;
	private Long receiver;
	private String solicitante;
	private String retirada;
	private String entrega;
	private Float vlrEntrega;
	private Float distancia;
	private String tipoPagamento;

}