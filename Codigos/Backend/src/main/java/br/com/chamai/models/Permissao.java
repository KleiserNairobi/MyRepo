package br.com.chamai.models;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Permissao {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "permissao_seq")
	@SequenceGenerator(name = "permissao_seq", sequenceName = "permissao_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 40, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;

	//@JsonBackReference
	//@ManyToMany(mappedBy = "permissoes")
	//private List<Usuario> usuarios = new ArrayList<>();

}
