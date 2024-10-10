package br.com.chamai.models.dto;

import br.com.chamai.models.enums.TipoPagamento;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

@Getter @Setter
@ApiModel(value = "PagamentoDto", description = "Model Pagamento para inclusão")
public class PagamentoDto {

    @ApiModelProperty(position = 1, required = false)
    private Long agendamento;

    @ApiModelProperty(position = 2, required = false)
    private Long entrega;

    @ApiModelProperty(position = 3, required = true)
    @NotNull(message = "Tabela de preço é obrigatória")
    private Long tabelaPreco;

    @ApiModelProperty(position = 4, required = false)
    private Long gateway;

    @ApiModelProperty(position = 5, required = false)
    @Column(name = "gateway_id_pagamento")
    private long gatewayIdPagamento;

    @ApiModelProperty(position = 6, required = false)
    @Column(name = "gateway_id_devolucao")
    private long gatewayIdDevolucao;

    @ApiModelProperty(position = 7, required = true, value = "D, CC, CD")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo de pagamento é obrigatório")
    private TipoPagamento tipoPgto;

    @ApiModelProperty(position = 8, required = true)
    @NotNull(message = "Valor do percurso é obrigatório")
    private Float valorPercurso;

    @ApiModelProperty(position = 9, required = true)
    @NotNull(message = "Valor do produto é obrigatório")
    private Float valorProduto;

    @ApiModelProperty(position = 10, required = false)
    private Long desconto;

    @ApiModelProperty(position = 11, required = true)
    @NotNull(message = "Valor do desconto é obrigatório")
    private Float valorDesconto;

    @ApiModelProperty(position = 12, required = false)
    private String observacao;

}
