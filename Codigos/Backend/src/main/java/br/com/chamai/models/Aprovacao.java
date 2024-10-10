package br.com.chamai.models;

import java.sql.Time;
import java.time.LocalDate;

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

import com.fasterxml.jackson.annotation.JsonFormat;

import br.com.chamai.models.enums.StatusAprovacao;
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
@SequenceGenerator(name = "aprovacao_seq", sequenceName = "aprovacao_seq", initialValue = 1, allocationSize = 1)
public class Aprovacao {

	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aprovacao_seq")
	private Long id;
	
	@NotNull(message = "Pessoa é obrigatória")
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	private Pessoa pessoa;
	
	@NotNull(message = "Status da aprovação é obrigatória")
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private StatusAprovacao statusAprovacao;
	
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate data;
	
	@JsonFormat(pattern = "HH:mm:ss")
	private Time hora;
	
}
