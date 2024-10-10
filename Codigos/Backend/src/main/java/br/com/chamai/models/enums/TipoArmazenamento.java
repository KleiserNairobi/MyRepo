package br.com.chamai.models.enums;

public enum TipoArmazenamento {
    LC("Local"), S3("AWS-S3");

    private String descricao;

    TipoArmazenamento(String descricao) {
        this.descricao = descricao;
    }

    public String toString(){
        return descricao;
    }
}
