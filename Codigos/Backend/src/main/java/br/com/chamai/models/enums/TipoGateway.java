package br.com.chamai.models.enums;

public enum TipoGateway {

    IG("Iugu"),
    MP("MercadoPago"),
    PM("Pagar.me"),
    PP("PicPay"),
    PS("PagSeguro"),
    WC("WireCard");

    private String descricao;

    TipoGateway(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }

}
