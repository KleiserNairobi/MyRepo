package br.com.chamai.util.socket;

import br.com.chamai.util.socket.enums.SocketAction;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter @Setter
public class SocketRequest {
	
	private final String action = SocketAction.ON_MESSAGE.toString();
	private final long sender = SocketClient.WEBSOCKET_ADMIN_ID;
	private long receiver;
	private SocketRequestMessage message;

}