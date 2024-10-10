package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@ApiModel(value = "Endereço - cadastro")
public class EnderecoCadDto {

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "ID da pessoa é obrigatório")
    private Long idPessoa;

    @ApiModelProperty(position = 2, required = true, example = "99999-999")
    @NotNull(message = "CEP é obrigatório")
    @Size(min = 9, max = 9, message = "CEP deve ter {max} caracteres")
    private String cep;

    @ApiModelProperty(position = 3, required = true)
    @NotNull(message = "Logradouro é obrigatório")
    @Size(max = 60, message = "Logradouro deve ter no máximo {max} caracteres")
    private String logradouro;

    @ApiModelProperty(position = 4, required = true)
    @NotEmpty(message = "Número é obrigatório")
    @Size(max = 10, message = "Número deve ter entre {min} e {max} caracteres")
    private String numero;

    @ApiModelProperty(position = 5, required = true)
    @NotNull(message = "Complemento é obrigatório")
    @Size(max = 60, message = "Complemento deve ter no máximo {max} caracteres")
    private String complemento;

    @ApiModelProperty(position = 6, required = true)
    @NotNull(message = "Bairro é obrigatório")
    @Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
    private String bairro;

    @ApiModelProperty(position = 7)
    @Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
    private String referencia;

    @ApiModelProperty(position = 8, required = true)
    @NotEmpty(message = "Município é obrigatório")
    @Size(max = 60, message = "Município deve ter no máximo {max} caracteres")
    private String municipio;

    @ApiModelProperty(position = 9, required = true)
    @NotEmpty(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter no máximo {max} caracteres")
    private String estado;

    @ApiModelProperty(position = 10, required = true)
    @NotNull(message = "Nome do cliente é obrigatório")
    @Size(max = 60, message = "Nome do cliente deve ter no máximo {max} caracteres")
    private String nomeCliente;

    @ApiModelProperty(position = 11, required = true)
    @NotEmpty(message = "Telefone do cliente é obrigatório")
    @Size(min = 13, max = 14, message = "Telefone do cliente deve ter entre {min} e {max} caracteres")
    private String telefoneCliente;

    @ApiModelProperty(position = 12, required = false)
    private Boolean proprio;

}
