package br.com.chamai.models.enums;

public enum StatusEntrega {

	NI("Não iniciada"),
	I("Iniciada"),
	EDR("Entregador em deslocamento para o local de retirada"),
	CA("Cancelada"),
	CO("Concluída"),
	ENE("Entregador não encontrado");

	private String descricao;

	StatusEntrega(String descricao) {
		this.descricao = descricao;
	}

	public String toString() {
		return this.descricao;
	}

}
