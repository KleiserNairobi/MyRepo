package br.com.chamai.util.socket.enums;

public enum SocketAction {
	
	ON_CONNECT("onConnect"), ON_MESSAGE("onMessage");
	
	private String descricao;
	
	private SocketAction(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString() {
		return descricao;
	}

}
