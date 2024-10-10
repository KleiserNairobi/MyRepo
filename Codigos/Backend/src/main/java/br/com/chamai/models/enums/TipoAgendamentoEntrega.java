package br.com.chamai.models.enums;

public enum TipoAgendamentoEntrega {
	
	O("Origem"), D("Destino");
	
	private String descricao;

  TipoAgendamentoEntrega(String descricao) {
      this.descricao = descricao;
  }

  public String toString(){
      return descricao;
  }

}
