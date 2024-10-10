package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ApiModel(value = "TrocarSenhaDto", description = "Model para recuperação/troca da senha")
public class TrocarSenhaDto {

    @ApiModelProperty(position = 0, required = true)
    @NotNull(message = "Email é obrigatório")
    private String email;

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Código é obrigatório")
    private String codigo;

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Senha é obrigatória")
    private String senha;

}
