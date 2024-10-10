package br.com.chamai.models.enums;

public enum OrigemReceber {
	
	A("Agendamento"),
	E("Entrega"),
	NF("Nota fiscal"),
	B("Boleto"),
	R("Recibo");

	private String descricao;

	OrigemReceber(String descricao) {
      this.descricao = descricao;
  }

	public String toString() {
		return descricao;
	}

}
