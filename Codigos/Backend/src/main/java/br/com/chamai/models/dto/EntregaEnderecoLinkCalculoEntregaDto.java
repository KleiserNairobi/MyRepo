package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoEndereco;

@ToString
@Valid
@Getter @Setter
@ApiModel(value = "EntregaEndereco-CalculoEntrega")
public class EntregaEnderecoLinkCalculoEntregaDto {

    @ApiModelProperty(position = 0, required = true, value = "O, D")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo entrega é obrigatório")
    private TipoEndereco tipoEndereco;

    @Size(max = 9, message = "CEP deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 1, required = false, value = "99999-999")
    private String cep;

    @NotNull(message = "Logradouro é obrigatório")
    @Size(max = 100, message = "Logradouro deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 2, required = true)
    private String logradouro;

    @Size(max = 10, message = "Número deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 3, required = false)
    private String numero;

    @NotNull(message = "Bairro é obrigatório")
    @Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 4, required = true)
    private String bairro;

    @NotNull(message = "Cidade é obrigatória")
    @Size(max = 60, message = "Cidade deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 5, required = true)
    private String cidade;

    @NotNull(message = "Estado é obrigatório")
    @Size(max = 2, message = "Estado deve ter no máximo {max} caracteres")
    @ApiModelProperty(position = 6, required = true)
    private String estado;
    
    @ApiModelProperty(position = 7, required = false)
    private Double lat;
    
    @ApiModelProperty(position = 8, required = false)
    private Double lng;

    @ApiModelProperty(position = 9, required = false)
    private Boolean proprio;

}
