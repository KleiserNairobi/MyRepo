package br.com.chamai.models;

import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Desconto {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "desconto_seq")
	@SequenceGenerator(name = "desconto_seq", sequenceName = "desconto_seq", initialValue = 1, allocationSize = 1)
	private Long id;

	@NotEmpty(message = "Código é obrigatório")
	@Size(max = 10, message = "Código deve ter no máximo {max} caracteres")
	private String codigo;

	@NotEmpty(message = "Descrição é obrigatória")
	@Size(min = 3, max = 45, message = "Descrição deve ter entre {min} e {max} caracteres")
	private String descricao;
	
	@NotNull(message = "Valor é obrigatório")
	private Float valor;

	@NotNull(message = "Piso é obrigatório")
	private Float piso;
	
	@NotNull(message = "Validade de início é obrigatória")
	private LocalDate validadeInicio;
	
	private LocalDate validadeFim;
	
}
