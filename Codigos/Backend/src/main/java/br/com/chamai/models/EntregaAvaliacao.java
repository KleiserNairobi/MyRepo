package br.com.chamai.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class EntregaAvaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entrega_avaliacao_seq")
    @SequenceGenerator(name = "entrega_avaliacao_seq", sequenceName = "entrega_avaliacao_seq", initialValue = 1, allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "entrega_id")
    @NotNull(message = "Entrega é obrigatória")
    private Entrega entrega;

    @ManyToOne
    @JoinColumn(name = "pessoa_id")
    @NotNull(message = "Membro é obrigatório")
    private Pessoa pessoa;

    @NotNull(message = "Classificação é obrigatória")
    private Double classificacao;

    private String comentario;

    @NotNull(message = "Data é obrigatória")
    private LocalDate data;

}
