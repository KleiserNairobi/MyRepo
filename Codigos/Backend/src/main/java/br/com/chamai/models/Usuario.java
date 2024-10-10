package br.com.chamai.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuario_seq")
	@SequenceGenerator(name = "usuario_seq", sequenceName = "usuario_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;

	private String email;

	private String telefone;

	private String senha;

	private String senhaSocial;

	private Boolean ativo;

	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatório")
	private Pessoa pessoa;

	//@JsonManagedReference
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "usuario_permissao",
		joinColumns = @JoinColumn(name = "usuario_id"),
		inverseJoinColumns = @JoinColumn(name = "permissao_id")
	)
	private List<Permissao> permissoes = new ArrayList<>();

	@Transient
	@JsonIgnore
	private String login;

	@JsonIgnore
	private String codigo;

}
