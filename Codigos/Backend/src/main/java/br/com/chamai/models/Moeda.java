package br.com.chamai.models;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity @ToString
@SequenceGenerator(name = "moeda_seq", sequenceName = "moeda_seq", initialValue = 1, allocationSize = 1)
public class Moeda {

    @ApiModelProperty(position = 0, required = true)
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "moeda_seq")
    private Long id;

    @ApiModelProperty(position = 1, required = true)
    @Size(max = 60, message = "Descrição deve ter no máximo {max} caracteres")
    @NotNull(message = "Descrição é obrigatório")
    private String descricao;

}
