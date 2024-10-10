package br.com.chamai.models;

import java.sql.Time;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import br.com.chamai.models.enums.Deslocamento;
import br.com.chamai.models.enums.TipoVeiculo;
import lombok.*;

@Builder
@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Entrega {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entrega_seq")
	@SequenceGenerator(name = "entrega_seq", sequenceName = "entrega_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "cliente_id")
	@NotNull(message = "Cliente é obrigatório")
	private Pessoa cliente;
	
	@ManyToOne
	@JoinColumn(name = "entregador_id")
	private Pessoa entregador;
	
	@ManyToOne
	@JoinColumn(name = "preferencia_id")
	private Pessoa preferencia;
	
	@ManyToOne
	@JoinColumn(name = "agendamento_id")
	private Agendamento agendamento;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "Tipo de veículo é obrigatório")
	private TipoVeiculo tipoVeiculo;

	@NotNull(message = "Data é obrigatória")
	private LocalDate data;
	
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Deslocamento é orbigatório")
	private Deslocamento deslocamento;

	@NotNull(message = "Distância é obrigatória")
	private Float distancia;

	@NotNull(message = "Previsão é obrigatória")
	private Time previsao;

	private Time horaMigracao;
	
	private Time horaExecucao;
	
	private Time horaSaida;
	
	private Time horaChegada;

}
