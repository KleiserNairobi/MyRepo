package br.com.chamai.models;

import javax.persistence.Column;
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

import br.com.chamai.models.enums.TipoConta;
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
@SequenceGenerator(name = "conta_seq", sequenceName = "conta_seq", initialValue = 1, allocationSize = 1)
public class Conta {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "conta_seq")
	private Long id;
	
	@NotNull(message = "Código é obrigatório")
	@Size(min = 1, max = 9, message = "Código deve ter entre {min} e {max} caracteres")
	private String codigo;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo")
	private TipoConta tipoConta;

	@NotNull(message = "Agência é obrigatória")
	@ManyToOne
	@JoinColumn(name = "agencia_id")
	private Agencia agencia;
	
	@NotNull(message = "Pessoa é obrigatória")
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	private Pessoa pessoa;
	
	private Boolean ativo;

}
