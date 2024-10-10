package br.com.chamai.models.enums;

public enum TipoEndereco {

	O("Origem"), D("Destino");

	private String descricao;

	TipoEndereco(String descricao) {
		this.descricao = descricao;
	}

	public String toString() {
		return descricao;
	}

}
