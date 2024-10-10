package br.com.chamai.models.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;

@Getter
@Setter
public class EntregaStatusDto {

    private Long idEntrega;
    private Long id;
    private LocalDate data;
    private Time hora;
    private String status;
    private String descricaoStatus;

}
