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
import br.com.chamai.models.enums.OperacaoMovimentoContaCaixa;
import br.com.chamai.models.enums.OrigemMovimentoContaCaixa;
import lombok.*;

@Builder
@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MovimentoContaCaixa {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movimento_conta_caixa_seq")
	@SequenceGenerator(name = "movimento_conta_caixa_seq", sequenceName = "movimento_conta_caixa_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@NotNull(message = "Conta caixa é obrigatório")
	@ManyToOne
	@JoinColumn(name = "conta_caixa_id")
	private ContaCaixa contaCaixa;

	@ManyToOne
	@JoinColumn(name = "categoria_id")
	@NotNull(message = "Categoria é obrigatória" )
	private Categoria categoria;
	
	@NotNull(message = "Origem é obrigatório")
	@Enumerated(EnumType.STRING)
	private OrigemMovimentoContaCaixa origem;
	
	@NotEmpty(message = "Documento é obrigatório")
	@Size(min = 3, max = 20, message = "Documento deve ter entre {min} e {max} caracteres")
	private String documento;
	
	@NotNull(message = "Operação é obrigatório")
	@Enumerated(EnumType.STRING)
	private OperacaoMovimentoContaCaixa operacao;
	
	@Column(insertable = false)
	private LocalDate data;
	
	@NotNull(message = "Valor é obrigatório")
	private Double valor;
	
	@NotEmpty(message = "Histórico é obrigatório")
	@Size(min = 3, max = 256, message = "Histórico deve ter entre {min} e {max} caracteres")
	private String historico;
	
}
