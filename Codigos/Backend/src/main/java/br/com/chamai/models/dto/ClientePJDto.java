package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Getter @Setter
@ApiModel(value = "Pessoa-Jurídica-Cliente")
public class ClientePJDto {

	@ApiModelProperty(position = 1, required = true)
    @NotEmpty(message = "Nome é obrigatório")
    @Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
    private String nome;

    @ApiModelProperty(position = 2, required = true)
    @NotEmpty(message = "Email é obrigatório")
    @Email(message = "Formato inválido")
    @Size(max = 100, message = "Email deve ter no máximo {max} caracteres")
    private String email;

    @ApiModelProperty(position = 3, required = true)
    @NotEmpty(message = "Telefone é obrigatório")
    @Size(min = 13, max = 14, message = "Telefone deve ter entre {min} e {max} caracteres")
    private String telefone;

    @ApiModelProperty(position = 4, example = "999.999.999-99 ou 99.999.999/9999-99")
    @Size(min = 14, max = 18, message = "CPF/CNPJ deve ter entre {min} e {max} caracteres")
    private String cpfCnpj;

    @ApiModelProperty(position = 5)
    @Size(max = 60, message = "Nome fantasia deve ter no máximo {max} caracteres")
    private String nomeFantasia;

    @ApiModelProperty(position = 6)
    @Size(max = 45, message = "Ramo atividade deve ter no máximo {max} caracteres")
    private String ramoAtividade;

    @ApiModelProperty(position = 7, required = true, example = "99999-999")
    @NotNull(message = "CEP é obrigatório")
    @Size(min = 9, max = 9, message = "CEP deve ter {max} caracteres")
    private String cep;

    @ApiModelProperty(position = 8, required = true)
    @NotNull(message = "Logradouro é obrigatório")
    @Size(max = 60, message = "Logradouro deve ter no máximo {max} caracteres")
    private String logradouro;

    @ApiModelProperty(position = 9, required = true)
    @NotEmpty(message = "Número é obrigatório")
    @Size(max = 10, message = "Número deve ter entre {min} e {max} caracteres")
    private String numero;

    @ApiModelProperty(position = 10, required = true)
    @NotNull(message = "Complemento é obrigatório")
    @Size(max = 60, message = "Complemento deve ter no máximo {max} caracteres")
    private String complemento;

    @ApiModelProperty(position = 11, required = true)
    @NotNull(message = "Bairro é obrigatório")
    @Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
    private String bairro;

    @ApiModelProperty(position = 12)
    @Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
    private String referencia;

    @ApiModelProperty(position = 13, required = true)
    @NotEmpty(message = "Nome é obrigatório")
    @Size(max = 60, message = "Município deve ter no máximo {max} caracteres")
    private String municipio;

    @ApiModelProperty(position = 14, required = true)
    @NotEmpty(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter no máximo {max} caracteres")
    private String estado;

    @ApiModelProperty(position = 15, required = true)
    @NotEmpty(message = "Senha é obrigatória")
    @Size(min = 4, message = "Senha deve ter no mínimo {min} caracteres")
    private String senha;

    @ApiModelProperty(position = 16, example = "-28.098883")
    private BigDecimal latitude;

    @ApiModelProperty(position = 17, example = "-048.675000")
    private BigDecimal longitude;

    @ApiModelProperty(position = 18, required = true)
    @NotNull(message = "Parceiro é obrigatório")
    private Boolean parceiro;

    @ApiModelProperty(position = 19, required = false)
    private Boolean proprio;

}
