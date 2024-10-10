package br.com.chamai.models;

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
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoContaCaixa;
import lombok.*;

@Builder
@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ContaCaixa {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "conta_caixa_seq")
	@SequenceGenerator(name = "conta_caixa_seq", sequenceName = "conta_caixa_seq", initialValue = 1, allocationSize = 1)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "conta_id")
	private Conta conta;

	@NotNull(message = "Nome é obrigatório")
	@Size(min = 3, max = 50, message = "Nome deve ter entre {min} e {max} caracteres")
	private String nome;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo")
	private TipoContaCaixa tipoContaCaixa;
	
	@NotEmpty(message = "Referência é obrigatória")
	@Size(min = 6, max = 7, message = "Referência deve ter entre {min} e {max} caracteres.")
	private String referencia;
	
	private LocalDate dataFechamento;
	
	private Double saldoAnterior;
	
	private Double movimentoRecebimento;
	
	private Double movimentoPagamento;
	
	private Double saldoAtual;
	
	private Double saldoDisponivel;

}
