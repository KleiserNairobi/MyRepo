package br.com.chamai.models;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import javax.validation.Valid;
import javax.validation.constraints.*;

@Getter
@Setter
@AllArgsConstructor
@Valid
public class DadosPagamentoCartao {

    @NotNull(message = "Código da pessoa é obrigatório")
    @ApiModelProperty(position = 1, required = true)
    private Long idPessoa;

    @NotNull(message = "Código do gateway é obrigatório")
    @ApiModelProperty(position = 2, required = true)
    private Long idGateway;

    @NotNull(message = "Número do cartão é obrigatório")
    @Size(min = 15, max = 16, message = "Número cartão deve ter entre {min} e {max} caracteres")
    @ApiModelProperty(position = 3, required = true)
    private String numeroCartao;

    @NotNull(message = "Mês de vencimento é obrigatório")
    @Min(value = 1, message = "Mês de vencimento não pode ser menor que 1")
    @Max(value = 12, message = "Mês de vencimento não pode ser maior que 12")
    @ApiModelProperty(position = 4, required = true)
    private int mesVencimento;

    @NotNull(message = "Ano de vencimento é obrigatório")
    @ApiModelProperty(position = 5, required = true)
    private int anoVencimento;

    @NotNull(message = "Código de segurança é obrigatório")
    @ApiModelProperty(position = 6, required = true)
    @Size(min = 3, max = 4, message = "Código segurança deve ter entre {min} e {max} caracteres")
    private String codigoSeguranca;

    @NotNull(message = "Nome titular do cartão é obrigatório")
    @NotEmpty(message = "Nome titular do cartão é obrigatório")
    @ApiModelProperty(position = 7, required = true)
    private String nomeTitularCartao;

    @NotNull(message = "Valor do produto é obrigatório")
    @ApiModelProperty(position = 9, required = true)
    private Float valorProduto;

    @NotNull(message = "Valor da entrega é obrigatório")
    @ApiModelProperty(position = 10, required = true)
    private Float valorEntrega;

    @Min(value = 1, message = "O número mínimo de parcela é 1")
    @Max(value = 12, message = "O número máximo de parcelas são 12")
    @NotNull(message = "Parcelas é obrigatório")
    @ApiModelProperty(position = 11, required = true)
    private Byte parcelas;

    @NotNull(message = "Método de pagamento é obrigatório")
    @NotEmpty(message = "Método de pagamento é obrigatório")
    @ApiModelProperty(position = 12, required = true)
    private String metodoPagamento;

    @NotNull(message = "Código do pagamento é obrigatório")
    @ApiModelProperty(position = 13, required = true)
    private Long idPagamento;

}
