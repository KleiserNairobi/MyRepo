package br.com.chamai.models;

import java.util.Date;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import br.com.chamai.models.enums.TipoVeiculo;
import lombok.*;

@Entity @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TabelaPreco {

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tabela_preco_seq")
	@SequenceGenerator(name = "tabela_preco_seq", sequenceName = "tabela_preco_seq", initialValue = 1, allocationSize = 1)
	private Long id;

	@NotNull(message = "Tipo de veículo é obrigatório")
	@Enumerated(EnumType.STRING)
	private TipoVeiculo tipoVeiculo;

	@NotEmpty(message = "Descrição é obrigatória")
	@Size(min = 3, max = 45, message = "Descrição deve ter entre {min} e {max} caracteres")
	private String descricao;
	
	@NotNull(message = "Validade de início é obrigatória")
	private Date validadeInicio;
	
	private Date validadeFim;

	@NotNull(message = "Tarifa km é obrigatório")
	private Float tarifaKm;
	
	@NotNull(message = "Tarifa valor é obrigatório")
	private Float tarifaValor;

	@NotNull(message = "Padrão é obrigatório")
	private Boolean padrao;

	@NotNull(message = "Ativo é obrigatório")
	private Boolean ativo;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "parceiro_tabela_preco",
		joinColumns = @JoinColumn(name = "tabela_preco_id"),
		inverseJoinColumns = @JoinColumn(name = "pessoa_id")
	)
	private List<Pessoa> pessoas;

//	@Transient
//	private TabelaPrecoItem tabelaPrecoItem;
	
}
