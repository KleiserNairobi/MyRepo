package br.com.chamai.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoCategoria;
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
@SequenceGenerator(name = "categoria_seq", sequenceName = "categoria_seq", initialValue = 1, allocationSize = 1)
public class Categoria {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "categoria_seq")
	@ApiModelProperty(position = 0, required = true)
	private Long id;

	@Column(name = "tipo")
	@NotNull(message = "Tipo categoria é obrigatório")
	@Enumerated(EnumType.STRING)
	@ApiModelProperty(position = 1, required = true, value = "R, D, A")
	private TipoCategoria tipoCategoria;

	@NotEmpty(message = "Código é obrigatório")
	@Size(max = 10, message = "Código deve ter no máximo {max} caracteres")
	@ApiModelProperty(position = 2, required = true)
	private String codigo;

	@NotEmpty(message = "Descrição é obrigatório")
	@Size(max = 60, message = "Descrição deve ter no máximo {max} caracteres")
	@ApiModelProperty(position = 3, required = true)
	private String descricao;
	
}
