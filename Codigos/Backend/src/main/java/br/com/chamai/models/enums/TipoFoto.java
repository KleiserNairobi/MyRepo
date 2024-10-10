package br.com.chamai.models.enums;

public enum TipoFoto {
	
	P("Perfil"),
	RG("Identidade"),
	CE("Comprovante de endereço"),
	CRLV("Veículo"),
	CNH("Habilitação");
	
	private String descricao;

    TipoFoto(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }

}
