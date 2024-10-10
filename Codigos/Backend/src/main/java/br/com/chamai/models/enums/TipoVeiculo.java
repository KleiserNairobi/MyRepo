package br.com.chamai.models.enums;

public enum TipoVeiculo {
	
	B("Bicicleta"), M("Moto"), C("Carro"), CM("Caminhão");

	private String descricao;

	TipoVeiculo(String descricao) {
		this.descricao = descricao;
	}

	public String toString() {
		return descricao;
	}

}
