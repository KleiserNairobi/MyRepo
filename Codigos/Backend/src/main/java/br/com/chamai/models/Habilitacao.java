package br.com.chamai.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Habilitacao {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "habilitacao_seq")
    @SequenceGenerator(name = "habilitacao_seq", sequenceName = "habilitacao_seq", initialValue = 1, allocationSize = 1)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "pessoa_id")
    @NotNull(message = "Pessoa é obrigatória")
    private Pessoa pessoa;

    @NotNull(message = "Registro é obrigatório")
    @Size(max = 15, message = "Registro deve ter no máximo {max} caracteres")
    private String registro;

    @NotNull(message = "Validade é obrigatória")
    private Date validade;

    @NotNull(message = "Categoria é obrigatória")
    @Size(max = 5, message = "Categoria deve ter no máximo {max} caracteres")
    private String categoria;

    @NotNull(message = "Local de Expedição é obrigatório")
    @Size(max = 60, message = "Local de Expedição deve ter no máximo {max} caracteres")
    private String localExpedicao;

    @NotNull(message = "Data de Emissão é obrigatória")
    private Date dataEmissao;

    private Date primeiraHabilitacao;

}
