package br.com.chamai.models.enums;

public enum TipoAgendamento {
	
	U("Único"), D("Diário"), S("Semanal"), Q("Quinzenal"), M("Mensal");
	
	private String descricao;

  TipoAgendamento(String descricao) {
      this.descricao = descricao;
  }

  public String toString(){
      return descricao;
  }

}
