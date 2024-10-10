package br.com.chamai.models;

import java.time.LocalDate;
import java.util.Date;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoPessoa;
import lombok.*;

@Entity
@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pessoa {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pessoa_seq")
	@SequenceGenerator(name = "pessoa_seq", sequenceName = "pessoa_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@NotNull(message = "Tipo é obrigatório")
	@Enumerated(EnumType.STRING)
	private TipoPessoa tipo;
	
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;

	@Email(message = "Formato inválido")
	@Size(max = 100, message = "Email deve ter no máximo {max} caracteres")
	private String email;

	@Size(min = 13, max = 14, message = "Telefone deve ter entre {min} e {max} caracteres")
	private String telefone;

	@Size(min = 14, max = 18, message = "CPF/CNPJ deve ter entre {min} e {max} caracteres")
	@Column(name = "cpf_cnpj")
	private String cpfCnpj;
	
	@Size(max = 60, message = "Nome fantasia deve ter no máximo {max} caracteres")
	@Column(name = "nome_fantasia")
	private String nomeFantasia;
	
	@Size(max = 45, message = "Ramo atividade deve ter no máximo {max} caracteres")
	@Column(name = "ramo_atividade")
	private String ramoAtividade;

	@Size(max = 45, message = "RG deve ter no máximo {max} caracteres")
	private String rg;

	private LocalDate nascimento;

	private Boolean parceiro;

	@NotNull(message = "Entregador é obrigatório")
	private Boolean entregador;
	
	@NotNull(message = "Cliente é obrigatório")
	private Boolean cliente;
	
	@NotNull(message = "Colaborador é obrigatório")
	private Boolean colaborador;

	@NotNull(message = "Colaborador é obrigatório")
	private Boolean ativo;

	private Boolean online;

	@Column(insertable = false, name = "data_inclusao")
	private LocalDate dataInclusao;
	
	@Column(name = "data_alteracao")
	private LocalDate dataAlteracao;

	@Transient
	private String senhaSocial;

	//@JsonManagedReference
	//@OneToMany(mappedBy = "pessoa")
	//private List<Endereco> enderecos = new ArrayList<>();
	
	//@JsonBackReference
	//@OneToMany(mappedBy = "pessoa")
	//private List<Usuario> usuarios = new ArrayList<>();

}
