package br.com.chamai.models;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data @Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Localizacao {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "localizacao_seq")
	@SequenceGenerator(name = "localizacao_seq", sequenceName = "localizacao_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatória")
	private Pessoa pessoa;

	private Boolean disponivel;
	
	@Column(insertable = false)
	private LocalDate data;
	
	@Column(insertable = false)
	private Time hora;
	
	@NotNull(message = "Latitude é obrigatória")
	private BigDecimal latitude;
	
	@NotNull(message = "Longitude é obrigatória")
	private BigDecimal longitude;
	
}
