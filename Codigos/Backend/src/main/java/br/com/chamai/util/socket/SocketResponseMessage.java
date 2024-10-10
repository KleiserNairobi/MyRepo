package br.com.chamai.util.socket;

import br.com.chamai.util.socket.enums.SocketAssunto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter @Setter
public class SocketResponseMessage {
	
	private SocketAssunto assunto; // CHAT | NOTIFICATION | NOTIFICATION_REPLY 
	private Long sender;
	private Long receiver;
	private boolean resposta;
	private String justificativa;
	private long idEntrega;

}