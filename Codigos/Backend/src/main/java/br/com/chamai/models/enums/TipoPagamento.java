package br.com.chamai.models.enums;

public enum TipoPagamento {
	
	D("Dinheiro"),
	CC("Cartão de crédito"),
	CD("Cartão de dédito");
	
	private String descricao;

  TipoPagamento(String descricao) {
      this.descricao = descricao;
  }

  public String toString(){
      return descricao;
  }

}
