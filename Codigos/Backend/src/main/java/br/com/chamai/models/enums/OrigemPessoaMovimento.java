package br.com.chamai.models.enums;

public enum OrigemPessoaMovimento {

    E("Entrega"),
    NF("Nota fiscal"),
    B("Boleto"),
    R("Recibo");

    private String descricao;

    OrigemPessoaMovimento(String descricao) {
        this.descricao = descricao;
    }

    public String toString() {
        return descricao;
    }

}
