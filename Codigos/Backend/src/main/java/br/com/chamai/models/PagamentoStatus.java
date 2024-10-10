package br.com.chamai.models;

import br.com.chamai.models.enums.StatusPagamento;
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
@IdClass(value = PagamentoStatusPK.class)
public class PagamentoStatus {

    @Id
    @ManyToOne
    @JoinColumn(name = "pagamento_id")
    @NotNull(message = "Pagamento é obrigatório")
    @ApiModelProperty(position = 1, required = true)
    private Pagamento pagamento;

    @Id
    @ApiModelProperty(position = 2, required = false)
    private Long id;

    @ApiModelProperty(position = 3, required = false, value = "yyyy-MM-dd")
    private LocalDate data;

    @ApiModelProperty(position = 4, required = false, value = "00:00:00")
    private Time hora;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status é obrigatório")
    @ApiModelProperty(position = 5, required = true, value = "I, N, A, TCP, TCC")
    private StatusPagamento status;

}
