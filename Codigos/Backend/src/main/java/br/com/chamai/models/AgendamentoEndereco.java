package br.com.chamai.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoAgendamentoEntrega;
import br.com.chamai.models.enums.TipoEndereco;
import lombok.*;
import java.math.BigDecimal;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AgendamentoEndereco {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "agendamento_endereco_seq")
	@SequenceGenerator(name = "agendamento_endereco_seq", sequenceName = "agendamento_endereco_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "agendamento_id")
	@NotNull(message = "Agendamento é obrigatório")
	private Agendamento agendamento;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo")
	@NotNull(message = "Tipo do endereço é obrigatório")
	private TipoEndereco tipoEndereco;
	
	@Size(max = 9, message = "CEP deve ter {max} caracteres")
	private String cep;
	
	@Size(max = 100, message = "Logradouro deve ter no máximo {max} caracteres")
	@NotNull(message = "Logradouro é obrigatório")
	private String logradouro;

	@Size(max = 10, message = "Número deve ter máximo de {max} caracteres")
	private String numero;
	
	@Size(max = 60, message = "Complemento deve ter máximo de {max} caracteres")
	private String complemento;

	@Size(max = 60, message = "Bairro deve ter no máximo {max} caracteres")
	private String bairro;

	@ManyToOne
	@JoinColumn(name = "municipio_id")
	private Municipio municipio;

	@Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
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
