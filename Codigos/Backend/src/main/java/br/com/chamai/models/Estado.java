package br.com.chamai.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Estado {

	@EqualsAndHashCode.Include
	@Id
	@Size(min = 2, max = 2)
	private String sigla;
	
	@NotNull(message = "Nome é obrigatório")
	@Size(min = 3, max = 40)
	private String nome;
	
}
