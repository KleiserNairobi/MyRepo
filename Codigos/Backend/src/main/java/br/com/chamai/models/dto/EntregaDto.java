package br.com.chamai.models.dto;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import br.com.chamai.models.enums.Deslocamento;
import br.com.chamai.models.enums.TipoVeiculo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
@ApiModel(value = "EntregaDto", description = "Model Entrega para inclusão")
public class EntregaDto {

    @ApiModelProperty(position = 0, required = true)
    @NotNull(message = "Cliente é obrigatório")
    private Long cliente;

    @ApiModelProperty(position = 1, required = false)
    private Long entregador;

    @ApiModelProperty(position = 2, required = false)
    private Long agendamento;

    @ApiModelProperty(position = 3, required = true, value = "B, M, C, CM")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo do veículo é obrigatório")
    private TipoVeiculo tipoVeiculo;

    @ApiModelProperty(position = 4, required = true, value = "yyyy-mm-dd")
    @NotNull(message = "Data é obrigatória")
    private LocalDate data;

    @ApiModelProperty(position = 5, required = true, value = "OD, ODO")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Deslocamento é orbigatório")
    private Deslocamento deslocamento;

    @ApiModelProperty(position = 6, required = true)
    @NotNull(message = "Distância é orbigatória")
    private Float distancia;

    @ApiModelProperty(position = 7, required = true, value = "hh:mm:ss")
    @NotNull(message = "Previsão é orbigatória")
    private Time previsao;
    
    @ApiModelProperty(position = 8, required = false, value = "hh:mm:ss")
    private Time horaExecucao;
    
    @ApiModelProperty(position = 9, required = false, value = "hh:mm:ss")
    private Time horaMigracao;

    @ApiModelProperty(position = 10, required = true)
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "entrega")
    @NotNull(message = "Lista de endereço é obrigatória")
    private List<EntregaEnderecoDto> listaEnderecos = new ArrayList<>();

    @ApiModelProperty(position = 11, required = false)
    private Long entregadorPreferencial;

}
