package br.com.chamai.events.listener;

import java.net.URISyntaxException;

import br.com.chamai.util.UtilMethods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import br.com.chamai.events.EntregaFinalizadaEvent;
import br.com.chamai.models.Entrega;
import br.com.chamai.services.EntregaService;
import br.com.chamai.util.socket.SocketClient;
import br.com.chamai.util.socket.SocketRequest;
import br.com.chamai.util.socket.SocketRequestMessage;
import br.com.chamai.util.socket.enums.SocketAssunto;

@Component
public class EntregaFinalizadaListener implements ApplicationListener<EntregaFinalizadaEvent> {
	
	@Autowired private EntregaService entregaService;
	
	@Override
	public void onApplicationEvent(EntregaFinalizadaEvent event) {
		notificarCliente(event.getIdEntrega());
	}

	private void notificarCliente(Long idEntrega) {
		Entrega entrega = entregaService.find(idEntrega);
		
		long idUsuario = entregaService.getIdUsuarioByCliente(entrega.getCliente());
		try (SocketClient socketClient = SocketClient.getConectionClient()) {
			socketClient.setConnectionLostTimeout(45);
			socketClient.connectBlocking();
			SocketRequestMessage message = SocketRequestMessage.builder()
					.assunto(SocketAssunto.DELIVERY_COMPLETED)
					.sender(UtilMethods.toLong(SocketClient.WEBSOCKET_ADMIN_ID))
					.receiver(idUsuario)
					.idEntrega(entrega.getId())
				.build();
			
			SocketRequest request = SocketRequest.builder()
					.receiver(idUsuario)
					.message(message)
				.build();
			
			socketClient.send(new Gson().toJson(request));
		} catch (URISyntaxException ex) {
			ex.printStackTrace();
		} catch (InterruptedException ex) {
			ex.printStackTrace();
		}
	}

}
