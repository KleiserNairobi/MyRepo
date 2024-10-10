package br.com.chamai.models;

import java.util.Date;
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
public class GatewayTaxa {

	@Id
	@EqualsAndHashCode.Include
	@ApiModelProperty(position = 1, required = true)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gateway_taxa_seq")
	@SequenceGenerator(name = "gateway_taxa_seq", sequenceName = "gateway_taxa_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "gateway_id")
	@ApiModelProperty(position = 2, required = true)
	private Gateway gateway;

	@ApiModelProperty(position = 3, required = true)
	@NotNull(message = "Data é orbigatório")
	private Date data;

	@ApiModelProperty(position = 4, required = true)
	@NotNull(message = "Débito é orbigatório")
	private Double debito;

	@ApiModelProperty(position = 5, required = true)
	@NotNull(message = "Crédito avista é orbigatório")
	private Double creditoAvista;

	@ApiModelProperty(position = 6, required = true)
	@NotNull(message = "Crédito parcelado é orbigatório")
	private Double creditoParcelado;

	@ApiModelProperty(position = 7, required = true)
	@NotNull(message = "Crédito antecipado é orbigatório")
	private Double creditoAntecipacao;

	@ApiModelProperty(position = 8, required = true)
	@NotNull(message = "Boleto é orbigatório")
	private Double boleto;

	@ApiModelProperty(position = 9, required = true)
	@NotNull(message = "Taxa Administrativa é orbigatória")
	private Double taxaAdministrativa;
}
