package br.com.chamai.models.enums;

public enum StatusAprovacao {
	
	E("Em análise"), A("Aprovado"), R("Rejeitado"), S("Suspenso"), P("Pendente");

	private String descricao;
	
	StatusAprovacao(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString( ) {
		return this.descricao;
	}

}
