package br.com.chamai.models.enums;

public enum StatusPagamento {

	I("Iniciado"),
	N("Negado"),
	A("Autorizado"),
	E("Efetuado"),
	NRE("Não realizado"),
	TCP("Taxa cancelamento pendente"),
	TCC("Taxa cancelamento concluída"),
	DEV("Devolvido"),
	EST("Estornado");

	private String descricao;

	private StatusPagamento(String descricao) {
		this.descricao = descricao;
	}

	public String toString() {
		return this.descricao;
	}

}
