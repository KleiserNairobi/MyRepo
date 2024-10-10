package br.com.chamai.models.enums;

public enum TipoContaCaixa {
	
	C("Corrente"), P("Poupança"), I("Investimento"), X("Caixa Interno");
	
	private String descricao;

  TipoContaCaixa(String descricao) {
      this.descricao = descricao;
  }

  public String toString(){
      return descricao;
  }

}
