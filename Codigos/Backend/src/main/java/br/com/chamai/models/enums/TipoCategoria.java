package br.com.chamai.models.enums;

public enum TipoCategoria {
	
	R("Receita"), D("Despesa"), A("Ambos");
	
	String descricao;
	
	private TipoCategoria(String descricao) {
		this.descricao = descricao;
	}
	
	public String toString() {
		return this.descricao;
	}

}
