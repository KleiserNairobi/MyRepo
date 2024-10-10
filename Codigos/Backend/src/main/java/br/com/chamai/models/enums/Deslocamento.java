package br.com.chamai.models.enums;

public enum Deslocamento {
	
	OD("Origem/destino"), ODO("Origem/destino/origem");
	
	private String descricao;
	
	Deslocamento(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString() {
		return this.descricao;
	}

}
