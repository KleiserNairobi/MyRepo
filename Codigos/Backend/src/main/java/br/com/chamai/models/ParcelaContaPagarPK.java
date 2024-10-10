package br.com.chamai.models;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@EqualsAndHashCode
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelaContaPagarPK implements Serializable {

	private static final long serialVersionUID = -3304664739246708522L;

	private Long contaPagar;
	private Long id;

}
