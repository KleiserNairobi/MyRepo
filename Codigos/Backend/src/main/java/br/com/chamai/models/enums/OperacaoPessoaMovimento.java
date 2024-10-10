package br.com.chamai.models.enums;

public enum OperacaoPessoaMovimento {

    C("Crédito"), D("Débito");

    private String descricao;

    OperacaoPessoaMovimento(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }

}
