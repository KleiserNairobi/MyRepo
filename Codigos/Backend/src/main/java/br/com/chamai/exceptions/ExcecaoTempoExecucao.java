package br.com.chamai.exceptions;

public class ExcecaoTempoExecucao extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ExcecaoTempoExecucao(String mensagem) {
        super(mensagem);
    }

    public ExcecaoTempoExecucao(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }

}
