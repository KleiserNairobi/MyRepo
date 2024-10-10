package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ApiModel(value = "PagamentoObsDto", description = "Registra observação em um pagamento")
public class PagamentoObsDto {

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Observação é obrigatória")
    private String observacao;

}
