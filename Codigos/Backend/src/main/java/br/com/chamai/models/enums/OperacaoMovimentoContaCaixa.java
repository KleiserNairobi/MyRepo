package br.com.chamai.models.enums;

public enum OperacaoMovimentoContaCaixa {
	
	C("Crédito"), D("Débito");
	
	private String descricao;

  OperacaoMovimentoContaCaixa(String descricao) {
      this.descricao = descricao;
  }

  public String toString(){
      return descricao;
  }

}
