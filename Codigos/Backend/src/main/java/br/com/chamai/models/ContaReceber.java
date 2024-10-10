package br.com.chamai.models;

import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.OrigemReceber;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "receber")
public class ContaReceber {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "receber_seq")
	@SequenceGenerator(name = "receber_seq", sequenceName = "receber_seq", initialValue = 1, allocationSize = 1)
	@ApiModelProperty(position = 0, required = true)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatório")
	@ApiModelProperty(position = 1, required = true)
	private Pessoa pessoa;
	
	@ManyToOne
	@JoinColumn(name = "categoria_id")
	@NotNull(message = "Categoria é obrigatório")
	@ApiModelProperty(position = 2, required = true)
	private Categoria categoria;

	@ManyToOne
	@JoinColumn(name = "moeda_id")
	@NotNull(message = "Moeda é obrigatória")
	@ApiModelProperty(position = 3, required = true)
	private Moeda moeda;
	
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Origem é obrigatória")
	@ApiModelProperty(position = 4, required = true)
	private OrigemReceber origem;
	
	@NotEmpty(message = "Documento é obrigatório")
	@Size(max = 20, message = "Documento deve ter no máximo {max} caracteres")
	@ApiModelProperty(position = 5, required = true)
	private String documento;

	@NotNull(message = "Data de emissão é obrigatória")
	@ApiModelProperty(position = 6, required = true)
	private LocalDate emissao;
	
	@NotNull(message = "Data do primeiro vencimento é obrigatório")
	@ApiModelProperty(position = 7, required = true)
	private LocalDate primeiroVcto;

	@NotNull(message = "Quantidade de parcelas é obrigatório")
	@ApiModelProperty(position = 8, required = true)
	private Byte parcelas;

	@NotNull(message = "Valor total é obrigatório")
	@ApiModelProperty(position = 9, required = true)
	private Double valorTotal;
	
	@NotNull(message = "Valor a receber é obrigatório")
	@ApiModelProperty(position = 10, required = true)
	private Double valorReceber;

	@ApiModelProperty(position = 11, required = false)
	private String historico;

}
