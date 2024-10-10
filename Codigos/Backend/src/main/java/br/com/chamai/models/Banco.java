package br.com.chamai.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Banco {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "banco_seq")
	@SequenceGenerator(name = "banco_seq", sequenceName = "banco_seq", initialValue = 758, allocationSize = 1)
	private Long id;
	
	@NotNull(message = "Código é obrigatório")
	@Size(min = 1, max = 4, message = "Código deve ter entre {min} e {max} caracteres")
	private String codigo;
	
	@NotNull(message = "Nome é obrigatório")
	@Size(min = 3, max = 40, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;
	
}
