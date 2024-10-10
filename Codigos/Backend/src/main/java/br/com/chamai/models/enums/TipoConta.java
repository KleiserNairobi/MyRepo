package br.com.chamai.models.enums;

public enum TipoConta {
	
	C("Corrente"), P("Poupança");
	
	private String descricao;

    TipoConta(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }

}
