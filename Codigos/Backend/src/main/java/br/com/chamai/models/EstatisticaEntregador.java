package br.com.chamai.models;

public interface EstatisticaEntregador {

    int getTotal();
    int getAtivo();
    int getInativo();
    int getOnline();
    int getOffline();
    int getDisponivel();
    int getOcupado();
}
