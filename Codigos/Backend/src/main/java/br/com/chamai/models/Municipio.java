package br.com.chamai.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Entity @ToString
@SequenceGenerator(name = "municipio_seq", sequenceName = "municipio_seq", initialValue = 5391, allocationSize = 1)
public class Municipio {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "municipio_seq")
	@ApiModelProperty(position = 0, required = true)
	private Long id;
	
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 60)
	@ApiModelProperty(position = 1, required = true)
	private String nome;
	
	@ManyToOne
	@JoinColumn(name = "estado_id")
	@NotNull(message = "Estado é obrigatório")
	@ApiModelProperty(position = 2, required = true)
	private Estado estado;

	@ApiModelProperty(position = 3, required = false)
	private Boolean cobertura;

}
