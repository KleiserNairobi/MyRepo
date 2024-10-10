package br.com.chamai.models;

import java.sql.Time;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import br.com.chamai.models.enums.TipoVeiculo;
import br.com.chamai.models.enums.Deslocamento;
import br.com.chamai.models.enums.TipoAgendamento;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Agendamento {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "agendamento_seq")
	@SequenceGenerator(name = "agendamento_seq", sequenceName = "agendamento_seq", initialValue = 1, allocationSize = 1)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "cliente_id")
	@NotNull(message = "Cliente é obrigatório")
	private Pessoa cliente;
	
	@ManyToOne
	@JoinColumn(name = "entregador_id")
	private Pessoa entregador;

	@Column(name = "id_origem")
	private Long idOrigem;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "Tipo agendamento é obrigatório")
	@Column(name = "tipo_agendamento")
	private TipoAgendamento tipoAgendamento;

	@NotNull(message = "Quantidade de repetição é obrigatória")
	@Column(name = "qtde_repeticao")
	private int qtdeRepeticao;

	@NotNull(message = "Data de entrega é obrigatória")
	@Column(name = "data_execucao")
	private LocalDate dataExecucao;

	@NotNull(message = "Hora da entrega é obrigatória")
	@Column(name = "hora_execucao")
	private Time horaExecucao;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "Tipo de veículo é obrigatório")
	@Column(name = "tipo_veiculo")
	private TipoVeiculo tipoVeiculo;

	@NotNull(message = "Deslocamento é obrigatório")
	@Enumerated(EnumType.STRING)
	private Deslocamento deslocamento;

	@NotNull(message = "Distância é obrigatória")
	private Float distancia;

	@NotNull(message = "Previsão é obrigatória")
	private Time previsao;

	@NotNull(message = "Ativo é obrigatório")
	private Boolean ativo;

	@NotNull(message = "Realizado é obrigatório")
	private Boolean realizado;

}
