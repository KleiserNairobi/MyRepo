package br.com.chamai.models;

import br.com.chamai.models.enums.StatusEntrega;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Time;
import java.time.LocalDate;

@Builder
@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(value = EntregaStatusPK.class)
public class EntregaStatus {

    @Id
    @ManyToOne
    @JoinColumn(name = "entrega_id")
    @NotNull(message = "Entrega é obrigatória")
    @ApiModelProperty(position = 1, required = true)
    private Entrega entrega;

    @Id
    @ApiModelProperty(position = 2, required = true)
    private Long id;

    @ApiModelProperty(position = 3, required = false, value = "yyyy-MM-dd")
    private LocalDate data;

    @ApiModelProperty(position = 4, required = false, value = "00:00:00")
    private Time hora;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status é obrigatório")
    @ApiModelProperty(position = 5, required = true, value = "NI, EDR, I, CA, CO, ENE")
    private StatusEntrega status;

}
