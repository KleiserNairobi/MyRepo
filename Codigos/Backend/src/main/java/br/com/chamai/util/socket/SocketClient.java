package br.com.chamai.util.socket;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.util.StringUtils;

import com.google.gson.Gson;

import br.com.chamai.util.socket.enums.SocketAssunto;
import br.com.chamai.util.socket.enums.SocketTipoPessoa;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class SocketClient extends WebSocketClient implements AutoCloseable {
	
	private final static Gson gson = new Gson();
	public final static int WEBSOCKET_ADMIN_ID = 1;
	private final static String WEBSOCKET_ADMIN_NAME = "WebSocket_API_AWS";
	public final static String URL = "wss://0pydy17fgf.execute-api.us-east-1.amazonaws.com/dev";
	public SocketResponseMessage responseMessage = null;

	public static SocketClient getConectionClient() throws URISyntaxException {
		return new SocketClient(new URI(SocketClient.URL + getParams()));
	}
	
	public static String getParams() {
		return "?idUsuario=" + WEBSOCKET_ADMIN_ID
				+ "&nomeUsuario=" + WEBSOCKET_ADMIN_NAME
				+ "&tipoPessoa=" + SocketTipoPessoa.COL;
	}
	
	public static String getURL() {
		return "wss://0pydy17fgf.execute-api.us-east-1.amazonaws.com/dev";
	}
	
	public SocketClient(URI serverUri) {
		super(serverUri);
	}

	@Override
	public void onOpen(ServerHandshake handshakedata) {
	}

	@Override
	public void onMessage(String message) {
		if (!StringUtils.isEmpty(message)) { // se msg for diferente de vazio
			ResponseMessage response = gson.fromJson(message, ResponseMessage.class); // converte string para SocketResponseMessage
			if (Objects.equals(response.getMessage().getAssunto(), SocketAssunto.NOTIFICATION_REPLY)) { // se for uma notificação resposta
				if (response.getMessage() != null) {
					// atribui resposta vinda do servidor para variável local que é verificada de tempos em tempos pelo entrega service
					responseMessage = response.getMessage();
				}
			}
		}
	}

	@Override
	public void onClose(int code, String reason, boolean remote) {
		System.out.println("=== | close websocket | ===");
		System.out.println("code => " + code);
		System.out.println("reason => " + reason);
		System.out.println("remote => " + remote);
	}

	@Override
	public void onError(Exception ex) {
		System.out.println("error => " + ex.getMessage());
		ex.printStackTrace();
	}
	
	
	@ToString
	private static class ResponseMessage {
		
		@Getter @Setter
		private SocketResponseMessage message;
		
	}
	
}
