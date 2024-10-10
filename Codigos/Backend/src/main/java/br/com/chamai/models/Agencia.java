package br.com.chamai.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Agencia {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "agencia_seq")
	@SequenceGenerator(name = "agencia_seq", sequenceName = "agencia_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@Size(min = 3, max = 15, message = "Código deve ter entre {min} e {max} caracteres")
	@NotNull(message = "Código é obrigatório")
	private String codigo;

	@Size(min = 3, max = 40, message = "Nome deve ter entre {min} e {max} caracteres")
	@NotNull(message = "Nome é obrigatório")
	private String nome;

	@ManyToOne
	@JoinColumn(name = "banco_id")
	@NotNull(message = "Banco é obrigatório")
	private Banco banco;
	
}
