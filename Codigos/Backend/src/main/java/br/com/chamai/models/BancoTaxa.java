package br.com.chamai.models;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity @ToString
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@SequenceGenerator(name = "banco_taxa_seq", sequenceName = "banco_taxa_seq", initialValue = 1, allocationSize = 1)
public class BancoTaxa {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "banco_taxa_seq")
    @ApiModelProperty(position = 0, required = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "banco_id")
    @NotNull(message = "Banco é obrigatório")
    @ApiModelProperty(position = 1, required = true)
    private Banco banco;

    @Temporal(TemporalType.DATE)
    @NotNull(message = "Data é obrigatória")
    @ApiModelProperty(position = 2, required = true)
    private Date data;

    @NotNull(message = "DOC é obrigatório")
    @ApiModelProperty(position = 3, required = true)
    private Float doc;

    @NotNull(message = "TED é obrigatório")
    @ApiModelProperty(position = 4, required = true)
    private Float ted;

}
