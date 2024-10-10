package br.com.chamai.models.dto;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import br.com.chamai.models.enums.TipoVeiculo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import br.com.chamai.models.enums.Deslocamento;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Valid
@Getter @Setter
@ApiModel(value = "Calculo-Entrega")
public class CalculoEntregaDto {

    @Getter(onMethod = @__({@JsonIgnore}))
    @Setter(onMethod = @__({@JsonProperty}))
    @NotNull(message = "Cliente é obrigatório")
    @ApiModelProperty(position = 0, required = true)
    private Long cliente;

    @NotNull(message = "Lista de endereços é obrigatória")
    @ApiModelProperty(position = 1, required = true)
    private List<EntregaEnderecoLinkCalculoEntregaDto> listaEnderecos = new ArrayList<>();

    @Getter(onMethod = @__({@JsonIgnore}))
    @Setter(onMethod = @__({@JsonProperty}))
    @NotNull(message = "Tipo de veículo é obrigatório")
    @Enumerated(EnumType.STRING)
    @ApiModelProperty(position = 2, required = true, value = "B, M, C, CM")
    private TipoVeiculo tipoVeiculo;

    @Getter(onMethod = @__({@JsonIgnore}))
    @Setter(onMethod = @__({@JsonProperty}))
    @NotNull(message = "Deslocamento é orbigatório")
    @Enumerated(EnumType.STRING)
    @ApiModelProperty(position = 3, required = true, value = "OD, ODO")
    private Deslocamento deslocamento;
    
    @ApiModelProperty(position = 4, required = false)
    private Float distancia;
    
    @ApiModelProperty(position = 5, required = false)
    private Float valorTotal;
    
    @ApiModelProperty(position = 6, required = false)
    private Time previsao;

    @ApiModelProperty(position = 6, required = false)
    private long tabelaPreco;

}
