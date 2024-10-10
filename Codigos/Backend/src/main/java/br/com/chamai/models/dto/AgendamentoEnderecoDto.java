package br.com.chamai.models.dto;

import br.com.chamai.models.Municipio;
import br.com.chamai.models.enums.TipoEndereco;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter @Setter
@ApiModel(value = "AgendamentoEnderecoDto", description = "Model Agendamento-Endereco para inclusão")
public class AgendamentoEnderecoDto {

    @ApiModelProperty(position = 1, required = true)
    @NotNull(message = "Tipo de endereço é obrigatório")
    @Enumerated(EnumType.STRING)
    private TipoEndereco tipoEndereco;

    @ApiModelProperty(position = 2, required = false, value = "99999-999")
    @Size(max = 9, message = "CEP deve ter no máximo {max} caracteres")
    private String cep;

    @ApiModelProperty(position = 3, required = true)
    @NotNull(message = "Logradouro é obrigatório")
    @Size(max = 100, message = "Logradouro deve ter no máximo {max} caracteres")
    private String logradouro;

    @ApiModelProperty(position = 4, required = false, value = "s/n quando não houver")
    @Size(max = 10, message = "Número deve ter no máximo {max} caracteres")
    private String numero;

    @ApiModelProperty(position = 5, required = false)
    @Size(max = 60, message = "Complemento deve ter no máximo {max} caracteres")
    private String complemento;

    @ApiModelProperty(position = 6, required = false)
    @Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
    private String bairro;

    @ApiModelProperty(position = 7, required = false)
    @ManyToOne
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;

    @ApiModelProperty(position = 8, required = false)
    @Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
    private String referencia;

    @ApiModelProperty(position = 9, required = false)
    @Size(max = 45, message = "Contato deve ter no máximo {max} caracteres")
    private String contato;

    @ApiModelProperty(position = 10, required = false, value = "(99)99999-9999")
    @Size(max = 14, message = "Telefone deve ter no máximo {max} caracteres")
    private String telefone;

    @ApiModelProperty(position = 11, required = false)
    @Size(max = 256, message = "Tarefa deve ter no máximo {max} caracteres")
    private String tarefa;

    @ApiModelProperty(position = 12, required = false)
    @Size(max = 60, message = "Nome do cliente deve ter no máximo {max} caracteres")
    private String nomeCliente;

    @ApiModelProperty(position = 13, required = false)
    @Size(max = 14, message = "Telefone do cliente deve ter no máximo e {max} caracteres")
    private String telefoneCliente;

    @ApiModelProperty(position = 14, required = false)
    private Boolean adicionarFavorito;

}
