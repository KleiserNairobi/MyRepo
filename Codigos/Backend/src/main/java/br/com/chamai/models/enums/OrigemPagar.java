package br.com.chamai.models.enums;

public enum OrigemPagar {
	
	A("Agendamento"),
	E("Entrega"),
	NF("Nota fiscal"),
	B("Boleto"),
	R("Recibo");

	private String descricao;

	OrigemPagar(String descricao) {
      this.descricao = descricao;
  }

	public String toString() {
		return descricao;
	}

}
