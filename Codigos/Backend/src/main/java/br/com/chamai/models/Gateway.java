package br.com.chamai.models;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoGateway;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@SequenceGenerator(name = "gateway_seq", sequenceName = "gateway_seq", initialValue = 1, allocationSize = 1)
public class Gateway {
	
	@EqualsAndHashCode.Include
	@Id
	@ApiModelProperty(position = 1, required = true)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gateway_seq")
	private Long id;

	@ApiModelProperty(position = 2, required = true, dataType = "string", value = "IG,MP,PM,PP,PS,WC")
	@NotNull(message = "Tipo de gateway é obrigatório")
	@Enumerated(EnumType.STRING)
	private TipoGateway tipoGateway;

	@ApiModelProperty(position = 3, required = true)
	@NotEmpty(message = "Nome é obrigatório")
	@Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;

	@ApiModelProperty(position = 4, required = false)
	private String chave;

	@ApiModelProperty(position = 5, required = false)
	private String token;

	@ApiModelProperty(position = 6, required = true, example = "false/true")
	@NotNull(message = "Ativo é obrigatório")
	private Boolean ativo;

}
