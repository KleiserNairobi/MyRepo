package br.com.chamai.exceptions;

import lombok.Getter;

@Getter
public enum TipoProblema {

    DADOS_INVALIDOS("/dados-invalidos", "Dados inválidos"),
    ACESSO_NEGADO("/acesso-negado", "Acesso negado"),
    ERRO_DE_SISTEMA("/erro-de-sistema", "Erro de sistema"),
    PARAMETRO_INVALIDO("/parametro-invalido", "Parâmetro inválido"),
    MENSAGEM_INCOMPREENSIVEL("/mensagem-incompreensivel", "Mensagem incompreensível"),
    RECURSO_NAO_ENCONTRADO("/recurso-nao-encontrado", "Recurso não encontrado"),
    ENTIDADE_EM_USO("/entidade-em-uso", "Entidade em uso"),
    ERRO_NEGOCIO("/erro-negocio", "Violação de regra de negócio"),
    INTEGRIDADE_DE_DADOS("/integridade-de-dados", "Integridade de dados");

    private String titulo;
    private String uri;

    TipoProblema(String caminho, String titulo) {
        this.uri = "https://chamai.com.br" + caminho;
        this.titulo = titulo;
    }

}
