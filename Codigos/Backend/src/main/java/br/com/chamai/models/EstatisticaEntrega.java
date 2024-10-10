package br.com.chamai.models;

public interface EstatisticaEntrega {

	int getTotal();
	int getNaoIniciada();
	int getConcluida();
	int getCancelada();
	int getEntregadorDeslocamentoRetirada();
	int getEntregadorNaoLocalizado();

}
