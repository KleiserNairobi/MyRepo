package br.com.chamai.models.dto;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter
@NoArgsConstructor
@ApiModel(value = "RespostaCancelaAgendamentoDto", description = "Resposta a solicitação de Cancelamento")
public class RespostaCancelaAgendamentoDto {

    private Long idContaPagar;
    private Float valorDevolver;

}
