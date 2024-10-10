package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter @Setter
@ApiModel(value = "Login Social Cliente")
public class ClienteLSDto {

    @ApiModelProperty(position = 0, required = true)
    @NotEmpty(message = "Nome é obrigatório")
    @Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
    private String nome;

    @ApiModelProperty(position = 1, required = true)
    @NotEmpty(message = "Email é obrigatório")
    @Email(message = "Formato do e-mail está inválido")
    @Size(max = 100, message = "Email deve ter no máximo {max} caracteres")
    private String email;

}
