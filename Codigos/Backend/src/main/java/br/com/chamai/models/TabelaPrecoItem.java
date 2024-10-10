package br.com.chamai.models;

import java.sql.Time;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TabelaPrecoItem {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tabela_preco_item_seq")
	@SequenceGenerator(name = "tabela_preco_item_seq", sequenceName = "tabela_preco_item_seq", initialValue = 1, allocationSize = 1)
	@ApiModelProperty(position = 0, required = true)
	private Long id;
	
	@NotNull(message = "Horário inicial é obrigatório")
	@ApiModelProperty(position = 1, required = true, dataType = "time", example = "12:00")
	private Time horaInicio;
	
	@NotNull(message = "Horário final é obrigatório")
	@ApiModelProperty(position = 2, required = true, dataType = "time", example = "12:00")
	private Time horaFim;
	
	@NotNull(message = "Tarifa adicional é obrigatório")
	@ApiModelProperty(position = 3, required = true, example = "15.00")
	private Float tarifaAdicional;
		
	@ManyToOne
	@JoinColumn(name = "tabela_preco_id")
	@NotNull(message = "Tabela de preço é obrigatório")
	@ApiModelProperty(position = 4, required = true)
	private TabelaPreco tabelaPreco;
	
}
