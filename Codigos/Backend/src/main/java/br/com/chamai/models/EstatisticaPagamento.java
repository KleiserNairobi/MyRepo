package br.com.chamai.models;

public interface EstatisticaPagamento {

	double getTotal();
	double getNegado();
	double getAutorizado();
	double getEfetuado();
	double getNaoRealizado();
	double getTaxaCancelamentoPendente();
	double getTaxaCancelamentoConcluida();
	double getDevolvido();
	double getEstornado();
	double getDinheiro();
	double getCartaoCredito();
	double getCartaoDebito();

}