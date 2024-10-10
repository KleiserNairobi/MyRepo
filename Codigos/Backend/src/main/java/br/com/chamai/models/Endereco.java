package br.com.chamai.models;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
//import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Endereco {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "endereco_seq")
	@SequenceGenerator(name = "endereco_seq", sequenceName = "endereco_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@NotNull(message = "CEP é obrigatório")
	@Size(min = 9, max = 9, message = "CEP deve ter {max} caracteres")
	private String cep;
	
	@NotNull(message = "Logradouro é obrigatório")
	@Size(max = 60, message = "Logradouro deve ter no máximo {max} caracteres")
	private String logradouro;
	
	@NotEmpty(message = "Número é obrigatório")
	@Size(max = 10, message = "Número deve ter no máximo {max} caracteres")
	private String numero;
	
	@NotNull(message = "Complemento é obrigatório")
	@Size(max = 60, message = "Complemento deve ter no máximo {max} caracteres")
	private String complemento;
	
	@NotNull(message = "Bairro é obrigatório")
	@Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
	private String bairro;
	
	@Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
	private String referencia;

	@ManyToOne
	@JoinColumn(name = "municipio_id")
	@NotNull(message = "Município é obrigatório")
	private Municipio municipio;

	//@JsonBackReference
	@ManyToOne()
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatória")
	private Pessoa pessoa;
	
	private Boolean ativo;

	private Boolean proprio;

	private BigDecimal latitude;

	private BigDecimal longitude;

	@Size(max = 60, message = "Nome deve ter entre no máximo {max} caracteres")
	private String nomeCliente;

	@Size(min = 13, max = 14, message = "Telefone deve ter entre {min} e {max} caracteres")
	private String telefoneCliente;

}
