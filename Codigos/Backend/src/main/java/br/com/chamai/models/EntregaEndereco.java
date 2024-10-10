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
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import br.com.chamai.models.enums.TipoEndereco;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SequenceGenerator(name = "entrega_endereco_seq", sequenceName = "entrega_endereco_seq", initialValue = 1, allocationSize = 1)
public class EntregaEndereco {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entrega_endereco_seq")
	private Long id;
	
	@NotNull(message = "Entrega é obrigatório")
	@ManyToOne
	@JoinColumn(name = "entrega_id")
	private Entrega entrega;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo")
	private TipoEndereco tipoEndereco;
	
	@Size(max = 9, message = "CEP deve ter no máximo {max} caracteres")
	private String cep;
	
	@NotNull(message = "Logradouro é obrigatório")
	@Size(max = 100, message = "Logradouro deve ter no máximo {max} caracteres")
	private String logradouro;

	@Size(max = 10, message = "Número deve ter no máximo {max} caracteres")
	private String numero;
	
	@Size(max = 60, message = "Complemento deve ter no máximo {max} caracteres")
	private String complemento;

	@Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
	private String bairro;

	@ManyToOne
	@JoinColumn(name = "municipio_id")
	private Municipio municipio;

	@Size(max = 60, message = "Referência deve ter máximo de {max} caracteres")
	private String referencia;
	
	@Size(max = 45, message = "Contato deve ter máximo de {max} caracteres")
	private String contato;
	
	@Size(max = 15, message = "Telefone deve ter máximo de {max} caracteres")
	private String telefone;
	
	@Size(max = 256, message = "Tarefa deve ter máximo de {max} caracteres")
	private String tarefa;

	private BigDecimal latitude;

	private BigDecimal longitude;

	@Transient
	private Boolean adicionarFavorito;
	
}
