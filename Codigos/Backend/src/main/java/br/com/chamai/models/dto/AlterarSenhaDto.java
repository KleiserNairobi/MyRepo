package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ApiModel(value = "AlterarSenhaDto", description = "Model para alteração da senha")
public class AlterarSenhaDto {

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Senha atual é obrigatória")
    private String senhaAtual;

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Nova senha é obrigatória")
    private String novaSenha;

}
