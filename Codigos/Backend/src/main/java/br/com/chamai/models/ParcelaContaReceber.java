package br.com.chamai.models;

import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(value = ParcelaContaReceberPK.class)
@Table(name = "parcela_receber")
public class ParcelaContaReceber {

	@Id
	@ManyToOne
	@JoinColumn(name = "receber_id")
	private ContaReceber contaReceber;

	@Id
	private Long id;

	@NotNull(message = "Data de emissão é obrigatório")
	private LocalDate dataEmissao;
	
	@NotNull(message = "Data de vencimento é obrigatório")
	private LocalDate dataVencimento;
	
	@NotNull(message = "Valor é obrigatório")
	private Double valor;
	
	private Double taxaJuro;
	
	private Double taxaMulta;
	
	private Double taxaDesconto;
	
	private Double valorJuro;
	
	private Double valorMulta;
	
	private Double valorDesconto;
	
	private LocalDate dataRecebimento;
	
	private Double valorRecebimento;

}
