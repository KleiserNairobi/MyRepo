package br.com.chamai.models;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoVeiculo;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Veiculo {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "veiculo_seq")
	@SequenceGenerator(name = "veiculo_seq", allocationSize = 1, initialValue = 1)
	private Long id;

	@Enumerated(EnumType.STRING)
	private TipoVeiculo tipo;

	@NotNull(message = "Modelo é obrigatório")
	@Size(max = 50, message = "Modelo deve ter no máximo {max} caracteres")
	private String modelo;

	@Size(max = 11, message = "Renavam deve ter no máximo {max} caracteres")
	private String renavan;

	@Size(max = 7, message = "Placa deve ter no máximo {max} caracteres")
	private String placa;

	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatória")
	private Pessoa pessoa;

	@NotNull(message = "Ativo é obrigatório")
	private Boolean ativo;
	
}
