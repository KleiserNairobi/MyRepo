package br.com.chamai.models.enums;

public enum OrigemMovimentoContaCaixa {

	R("Receber"), P("Pagar"), B("Banco"), O("Outros");

	private String descricao;

	OrigemMovimentoContaCaixa(String descricao) {
      this.descricao = descricao;
  }

	public String toString() {
		return descricao;
	}

}
