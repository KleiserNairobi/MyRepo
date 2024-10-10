package br.com.chamai.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
@SequenceGenerator(name = "cartao_seq", sequenceName = "cartao_seq", initialValue = 1, allocationSize = 1)
public class Cartao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cartao_seq")
	private Long id;
	
	@NotNull(message = "Pessoa é obrigatória")
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	private Pessoa pessoa;
	
	@Getter(onMethod = @__({@JsonIgnore}))
  @Setter(onMethod = @__({@JsonProperty}))
	private byte[] numeroCartao;
	
	@Transient
	@NotEmpty(message = "Número é obrigatório")
	@Size(min = 3, max = 16, message = "Número deve ter entre {min} e {max} caracteres")
	@Column(insertable = false, updatable = false)
	private String numero;
	
	@Getter(onMethod = @__({@JsonIgnore}))
	@Setter(onMethod = @__({@JsonProperty}))
	private byte[] validadeCartao;
	
	@Transient
	@NotEmpty
	@Size(min = 5, max = 5, message = "Validade deve ter 5 caracteres")
	private String validade;
	
	@Getter(onMethod = @__({@JsonIgnore}))
	@Setter(onMethod = @__({@JsonProperty}))
	private byte[] nomeCartao;
	
	@Transient
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;
	
	@Getter(onMethod = @__({@JsonIgnore}))
  @Setter(onMethod = @__({@JsonProperty}))
	private byte[] cwCartao;
	
	@Transient
	@NotEmpty(message = "Cw é obrigatório")
	@Size(max = 3, message = "Cw deve ter entre {min} e {max} caracteres")
	@Column(insertable = false, updatable = false)
	private String cw;
	
	@Getter(onMethod = @__({@JsonIgnore}))
	@Setter(onMethod = @__({@JsonProperty}))
	private byte[] ativoCartao;
	
	@Transient
	@NotNull(message = "Ativo é obrigatório")
	private Boolean ativo;

}
