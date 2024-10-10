package br.com.chamai.models;

import br.com.chamai.models.enums.OperacaoPessoaMovimento;
import br.com.chamai.models.enums.OrigemPessoaMovimento;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity @ToString
@SequenceGenerator(name = "pessoa_movimento_seq", sequenceName = "pessoa_movimento_seq", initialValue = 1, allocationSize = 1)
public class PessoaMovimento {

    @ApiModelProperty(position = 0, required = true)
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pessoa_movimento_seq")
    private Long id;

    @ApiModelProperty(position = 1, required = true)
    @ManyToOne
    @JoinColumn(name = "pessoa_id")
    @NotNull(message = "Pessoa é obrigatória")
    private Pessoa pessoa;

    @ApiModelProperty(position = 2, required = true, value = "E, NF, B, R")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Origem é obrigatória")
    private OrigemPessoaMovimento origem;

    @ApiModelProperty(position = 3, required = true)
    @NotNull(message = "Documento é obrigatório")
    private String documento;

    @ApiModelProperty(position = 4, required = true, value = "C, D")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Operação é obrigatória")
    private OperacaoPessoaMovimento operacao;

    @ApiModelProperty(position = 5, required = true)
    @NotNull(message = "Data é obrigatória")
    private LocalDate data;

    @ApiModelProperty(position = 6, required = true)
    @NotNull(message = "Hora é obrigatória")
    private LocalTime hora;

    @ApiModelProperty(position = 7, required = true)
    @NotNull(message = "Valor é obrigatório")
    private Double valor;

    @ApiModelProperty(position = 8, required = true)
    @NotNull(message = "Quitado é obrigatório")
    private Boolean quitado;

    @ApiModelProperty(position = 9, required = true)
    @NotNull(message = "Histórico é obrigatório")
    private String historico;

}
