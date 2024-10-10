package br.com.chamai.models.dto;

import br.com.chamai.models.enums.Deslocamento;
import br.com.chamai.models.enums.TipoAgendamento;
import br.com.chamai.models.enums.TipoVeiculo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@ApiModel(value = "AgendamentoDto", description = "Model Agendamento para inclusão")
public class AgendamentoDto {

    @ApiModelProperty(position = 0, required = true)
    @NotNull(message = "Cliente é obrigatório")
    private Long cliente;

    @ApiModelProperty(position = 1, required = false)
    private Long entregador;

    @ApiModelProperty(position = 3, required = true, value = "U, D, S, Q, M")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo de Agendamento é obrigatório")
    private TipoAgendamento tipoAgendamento;

    @ApiModelProperty(position = 4, required = true)
    @NotNull(message = "Quantidade de Repetição é obrigatória")
    private Integer qtdeRepeticao;

    @ApiModelProperty(position = 5, required = true, value = "yyyy-mm-dd")
    @NotNull(message = "Data de Execução é obrigatória")
    private LocalDate dataExecucao;

    @ApiModelProperty(position = 6, required = true, value = "hh:mm:ss")
    @NotNull(message = "Hora de Execução é orbigatória")
    private Time horaExecucao;

    @ApiModelProperty(position = 7, required = true, value = "B, M, C, CM")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo do veículo é obrigatório")
    private TipoVeiculo tipoVeiculo;

    @ApiModelProperty(position = 8, required = true, value = "OD, ODO")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Deslocamento é orbigatório")
    private Deslocamento deslocamento;

    @ApiModelProperty(position = 9, required = true)
    @NotNull(message = "Distância é orbigatória")
    private Float distancia;

    @ApiModelProperty(position = 10, required = true, value = "hh:mm:ss")
    @NotNull(message = "Previsão é orbigatória")
    private Time previsao;

    @ApiModelProperty(position = 11, required = true)
    @NotNull(message = "Ativo é orbigatório")
    private Boolean ativo;

    @ApiModelProperty(position = 12, required = true)
    @NotNull(message = "Realizado é orbigatório")
    private Boolean realizado;

    @ApiModelProperty(position = 13, required = true)
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "agendamento")
    @NotNull(message = "Lista de endereço é obrigatória")
    private List<AgendamentoEnderecoDto> listaEnderecos = new ArrayList<>();

}
