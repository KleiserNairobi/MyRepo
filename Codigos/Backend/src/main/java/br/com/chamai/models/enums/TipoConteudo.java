package br.com.chamai.models.enums;

public enum TipoConteudo {
	
	JPG("jpg"),
	JPEG("jpeg"),
	PNG("png");
	
	private String descricao;

    TipoConteudo(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }

}
