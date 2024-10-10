package br.com.chamai.util.gateways.mercadopago;

import br.com.chamai.models.DadosPagamentoCartao;
import br.com.chamai.models.Pagamento;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.services.PagamentoService;
import br.com.chamai.services.PessoaService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.mercadopago.MercadoPago;
import com.mercadopago.core.MPApiResponse;
import com.mercadopago.core.annotations.rest.PayloadType;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.exceptions.MPRestException;
import com.mercadopago.net.HttpMethod;
import com.mercadopago.net.MPRestClient;
import com.mercadopago.resources.Payment;
import com.mercadopago.resources.datastructures.payment.Address;
import com.mercadopago.resources.datastructures.payment.Identification;
import com.mercadopago.resources.datastructures.payment.Payer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import springfox.documentation.spring.web.json.Json;

@Service
public class MercadoPagoService {

    @Autowired private PessoaService pessoaService;
    @Autowired private PagamentoService pagamentoService;

    public String devolve(Long gatewayIdPagamento, String PublicKey, String AccessToken) throws MPException {
        MercadoPago.SDK.setAccessToken(AccessToken);
        Payment pagamento = Payment.findById(gatewayIdPagamento.toString());
        pagamento.refund();
        String idDevolucao = pagamento.getRefunds().get(0).getId();
        return idDevolucao;
    }

    public String processa(DadosPagamentoCartao entity, String PublicKey, String AccessToken) throws MPException {
        Pessoa pessoa = pessoaService.find(entity.getIdPessoa());
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        MercadoPago.SDK.setAccessToken(AccessToken);

        // Campos mínimos requeridos para processar um pagamento no MercadoPago
        // token: nesse caso, o access token
        // transaction_amount: o valor da transação
        // installments: a quantidade de parcela/prestação
        // payment_method_id: a forma de pagamento
        // payer.email: o e-mail do pagador
        Payment pagamento = new Payment()
                .setToken(getCardToken(entity, pessoa, PublicKey))
                .setDescription("Título do produto")
                .setTransactionAmount(entity.getValorProduto() + entity.getValorEntrega())
                .setInstallments(entity.getParcelas().intValue())
                .setPaymentMethodId(entity.getMetodoPagamento())
                .setPayer(new Payer()
                        .setEmail("test@test.com")
                        .setFirstName("Test")
                        .setLastName("User")
                        .setIdentification(new Identification()
                                .setType("CPF")
                                .setNumber("19119119100"))
                        .setAddress(new Address()
                                .setZipCode("06233200")
                                .setStreetName("Av. das Nações Unidas")
                                .setStreetNumber(3003)
                                .setNeighborhood("Bonfim")
                                .setCity("Osasco")
                                .setFederalUnit("SP"))
                );

        pagamento.save();

        if ( pagamento.getId() !=  null ) {
            inseriGatewayIdPagamento(entity, pagamento);
        }

        return gson.toJson(montaJsonRetorno(pagamento));
    }

    private void inseriGatewayIdPagamento(DadosPagamentoCartao entity, Payment pagamento) {
        if (pagamento.getStatus().toString().equals("approved")) {
            Pagamento pgto = pagamentoService.find(entity.getIdPagamento());
            pgto.setGatewayIdPagamento(Long.valueOf(pagamento.getId()));
            pagamentoService.update(pgto, entity.getIdPagamento());
        }
    }

    private String getCardToken(DadosPagamentoCartao entity, Pessoa pessoa, String PublicKey) throws MPException {
        JsonObject dadosCartao = new JsonObject();
        dadosCartao.addProperty("card_number", entity.getNumeroCartao());
        dadosCartao.addProperty("security_code", entity.getCodigoSeguranca());
        dadosCartao.addProperty("expiration_month", entity.getMesVencimento());
        dadosCartao.addProperty("expiration_year", entity.getAnoVencimento());

        JsonObject identificacao = new JsonObject();
        identificacao.addProperty("type", (pessoa.getTipo().equals(TipoPessoa.F)) ? "CPF" : "CNPJ" );
        identificacao.addProperty("number", pessoa.getCpfCnpj());

        JsonObject titular = new JsonObject();
        titular.addProperty("name", entity.getNomeTitularCartao().toUpperCase());
        titular.add("identification", identificacao);

        dadosCartao.add("cardholder", titular);
        MPApiResponse response;

        try {
            MPRestClient client = new MPRestClient();
            response = client.executeRequest(
                    HttpMethod.POST,
                    MercadoPago.SDK.getBaseUrl() + "/v1/card_tokens?public_key=" + PublicKey,
                    PayloadType.JSON,
                    dadosCartao
            );
        } catch (MPRestException rex) {
            throw new MPException(rex);
        }

        return ((JsonObject) response.getJsonElementResponse()).get("id").getAsString();
    }

    private String getResposta(String statusDetail) {
        String resposta = "";
        switch (statusDetail) {
            case "accredited":
                resposta = RespostasMercadoPago.accredited.toString();
                break;
            case "pending_contingency":
                resposta = RespostasMercadoPago.pending_contingency.toString();
                break;
            case "pending_review_manual":
                resposta = RespostasMercadoPago.pending_review_manual.toString();
                break;
            case "cc_rejected_bad_filled_card_number":
                resposta = RespostasMercadoPago.cc_rejected_bad_filled_card_number.toString();
                break;
            case "cc_rejected_bad_filled_date":
                resposta = RespostasMercadoPago.cc_rejected_bad_filled_date.toString();
                break;
            case "cc_rejected_bad_filled_other":
                resposta = RespostasMercadoPago.cc_rejected_bad_filled_other.toString();
                break;
            case "cc_rejected_bad_filled_security_code":
                resposta = RespostasMercadoPago.cc_rejected_bad_filled_security_code.toString();
                break;
            case "cc_rejected_blacklist":
                resposta = RespostasMercadoPago.cc_rejected_blacklist.toString();
                break;
            case "cc_rejected_call_for_authorize":
                resposta = RespostasMercadoPago.cc_rejected_call_for_authorize.toString();
                break;
            case "cc_rejected_card_disabled":
                resposta = RespostasMercadoPago.cc_rejected_card_disabled.toString();
                break;
            case "cc_rejected_card_error":
                resposta = RespostasMercadoPago.cc_rejected_card_error.toString();
                break;
            case "cc_rejected_duplicated_payment":
                resposta = RespostasMercadoPago.cc_rejected_duplicated_payment.toString();
                break;
            case "cc_rejected_high_risk":
                resposta = RespostasMercadoPago.cc_rejected_high_risk.toString();
                break;
            case "cc_rejected_insufficient_amount":
                resposta = RespostasMercadoPago.cc_rejected_insufficient_amount.toString();
                break;
            case "cc_rejected_invalid_installments":
                resposta = RespostasMercadoPago.cc_rejected_invalid_installments.toString();
                break;
            case "cc_rejected_max_attempts":
                resposta = RespostasMercadoPago.cc_rejected_max_attempts.toString();
                break;
            case "cc_rejected_other_reason":
                resposta = RespostasMercadoPago.cc_rejected_other_reason.toString();
                break;
        }
        return resposta;
    }

    private JsonObject montaJsonRetorno(Payment pagamento) {
        JsonObject dadosRetorno = new JsonObject();

        if (pagamento.getId() == null) {
            dadosRetorno.addProperty("id", "");
        } else {
            dadosRetorno.addProperty("id", pagamento.getId());
        }

        if (pagamento.getStatus() == null) {
            dadosRetorno.addProperty("status", "rejected");
        } else {
            dadosRetorno.addProperty("status", pagamento.getStatus().toString());
        }

        if (pagamento.getStatusDetail() == null) {
            // Criar uma classe e converter objeto json nessa
            dadosRetorno.addProperty("statusDetail", pagamento.getLastApiResponse().getReasonPhrase());
            dadosRetorno.addProperty("response", pagamento.getLastApiResponse().getStringResponse());
        } else {
            dadosRetorno.addProperty("statusDetail", pagamento.getStatusDetail());
            dadosRetorno.addProperty("response", getResposta(pagamento.getStatusDetail()));
        }

        if (pagamento.getTransactionDetails() == null) {
            dadosRetorno.addProperty("totalPaidAmount", "0.00");
            dadosRetorno.addProperty("installmentAmount", "0.00");
            dadosRetorno.addProperty("netReceivedAmount", "0.00");
            dadosRetorno.addProperty("overpaidAmount", "0.00");
        } else {
            dadosRetorno.addProperty("totalPaidAmount",
                    pagamento.getTransactionDetails().getTotalPaidAmount().toString()
            );
            dadosRetorno.addProperty("installmentAmount",
                    pagamento.getTransactionDetails().getInstallmentAmount().toString()
            );
            dadosRetorno.addProperty("netReceivedAmount",
                    pagamento.getTransactionDetails().getNetReceivedAmount().toString()
            );
            dadosRetorno.addProperty("overpaidAmount",
                    pagamento.getTransactionDetails().getOverpaidAmount().toString()
            );
        }

        if (pagamento.getDateCreated() == null) {
            dadosRetorno.addProperty("dateCreated", "");
        } else {
            dadosRetorno.addProperty("dateCreated",
                    pagamento.getDateCreated().toString()
            );
        }

        if (pagamento.getDateApproved() == null) {
            dadosRetorno.addProperty("dateApproved", "");
        } else {
            dadosRetorno.addProperty("dateApproved",
                    pagamento.getDateApproved().toString()
            );
        }

        return dadosRetorno;
    }



    // CARTÕES DE TESTE
    // Cartão           Número               Cod. Seg    Data Venc.
    // Mastercard       5031433215406351         123     11/25
    // Visa             4235647728025682         123     11/25
    // American Express 375365153556885          1234    11/25

    // PARA TESTAR DIFERENTES RESULTADOS DE PAGAMENTO, PREENCHA O DADO QUE QUISER NO NOME DO TITULAR DO CARTÃO:
    // APRO: Pagamento aprovado.
    // CONT: Pagamento pendente.
    // OTHE: Recusado por erro geral.
    // CALL: Recusado com validação para autorizar.
    // FUND: Recusado por quantia insuficiente.
    // SECU: Recusado por código de segurança inválido.
    // EXPI: Recusado por problema com a data de vencimento.
    // FORM: Recusado por erro no formulário

    //MercadoPago.SDK.setAccessToken("ACCESS_TOKEN");
    //MercadoPago.SDK.setClientSecret(System.getenv("CLIENT_SECRET_OK"));
    //MercadoPago.SDK.setClientId(System.getenv("CLIENT_ID_OK"));

    // Cria um objeto de preferência
    //Preference preference = new Preference();

    // Cria um item na preferência
    //Item item = new Item();
    //item.setTitle("Meu produto")
    //    .setQuantity(1)
    //    .setUnitPrice((float) 75.56);
    //preference.appendItem(item);
    //preference.save();

    // Dados do comprador / pagador
    //Payer payer = new Payer();
    //payer.setName("Joao")
    //        .setSurname("Silva")
    //        .setEmail("user@email.com")
    //        .setDateCreated("2018-06-02T12:58:41.425-04:00")
    //        .setPhone(new Phone()
    //            .setAreaCode("11")
    //            .setPhoneNumber("4444-4444"))
    //        .setIdentification(new Identification()
    //            .setType("CPF")
    //            .setNumber("19119119100"))
    //        .setAddress(new Address()
    //            .setStreetName("Street")
    //            .setBuildingNumber("123")
    //            .setZipCode("06233200"));

    // Dados do item comprado
    //Item item = new Item();
    //item.setId("1234")
    //    .setTitle("Lightweight Paper Table")
    //    .setDescription("Inspired by the classic foldable art of origami")
    //    .setCategoryId("home")
    //    .setQuantity(3)
    //    .setCurrencyId("BRL")
    //    .setUnitPrice((float) 55.41);

    // Guarda os dados do cliente
    //Customer customer = new Customer();
    //customer.setEmail("deanna_hegmann@gmail.com");
    //customer.save();

    // Guarda os dados do cartão
    //Card card = new Card();
    //card.setToken("9b2d63e00d66a8c721607214cedaecda");
    //card.setCustomerId(customer.getId());
    //card.save();

    // Adiciona novos cartões ao cliente
    //Customer customer = Customer.load("247711297-jxOV430go9fx2e")
    //Card card = new Card();
    //card.setToken("9b2d63e00d66a8c721607214cedaecda");
    //card.setCustomerId(customer.getID());
    //card.save();

}
