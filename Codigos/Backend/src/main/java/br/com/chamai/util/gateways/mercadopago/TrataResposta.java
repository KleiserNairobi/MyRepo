package br.com.chamai.util.gateways.mercadopago;

import com.mercadopago.resources.Payment;

import java.util.ArrayList;

public class TrataResposta {

    // Falta verificar se o Mercado Pago ainda retorna esse tipo de erro
    public String getErro(Payment pagamento) {

        ArrayList<ErrosDeInsercao> listaDeErros = new ArrayList<>();
        ErrosDeInsercao erro = new ErrosDeInsercao();

        erro.setCodigo("106");
        erro.setDescricao("Não pode efetuar pagamentos a usuários de outros países.");
        listaDeErros.add(erro);

        erro.setCodigo("109");
        erro.setDescricao("O payment_method_id não processa pagamentos parcelados. Escolha outro cartão ou outra forma de pagamento.");
        listaDeErros.add(erro);

        erro.setCodigo("126");
        erro.setDescricao("Não conseguimos processar seu pagamento.");
        listaDeErros.add(erro);

        erro.setCodigo("129");
        erro.setDescricao("O payment_method_id não processa pagamentos para o valor selecionado. Escolha outro cartão ou outra forma de pagamento.");
        listaDeErros.add(erro);

        erro.setCodigo("145");
        erro.setDescricao("Uma das partes com a qual está tentando realizar o pagamento é um usuário de teste e a outra é um usuário real.");
        listaDeErros.add(erro);

        erro.setCodigo("150");
        erro.setDescricao("Você não pode efetuar pagamentos.");
        listaDeErros.add(erro);

        erro.setCodigo("151");
        erro.setDescricao("Você não pode efetuar pagamentos.");
        listaDeErros.add(erro);

        erro.setCodigo("160");
        erro.setDescricao("Não conseguimos processar seu pagamento.");
        listaDeErros.add(erro);

        erro.setCodigo("204");
        erro.setDescricao("O payment_method_id não está disponível nesse momento. Escolha outro cartão ou outra forma de pagamento.");
        listaDeErros.add(erro);

        erro.setCodigo("801");
        erro.setDescricao("Você realizou um pagamento similar há poucos instantes. Tente novamente em alguns minutos.");
        listaDeErros.add(erro);

        return "sucesso";
    }

}
