package br.com.chamai.util.socket.enums;

public enum SocketTipoPagamento {
	
	DINHEIRO("dinheiro"), CARTAO("cartao");
	
	private String descricao;
	
	private SocketTipoPagamento(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString() {
		return descricao;
	}

}
