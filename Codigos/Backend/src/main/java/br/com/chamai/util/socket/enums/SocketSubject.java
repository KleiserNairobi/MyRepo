package br.com.chamai.util.socket.enums;

public enum SocketSubject {
	
	NOTIFICACAO("notificacao"), RESP_NOTIFICACAO("resp-notificacao");
	
	private String descricao;
	
	private SocketSubject(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString() {
		return descricao;
	}

}
