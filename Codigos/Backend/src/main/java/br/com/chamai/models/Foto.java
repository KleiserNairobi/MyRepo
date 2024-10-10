package br.com.chamai.models;

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

import br.com.chamai.models.enums.TipoConteudo;
import br.com.chamai.models.enums.TipoFoto;
import lombok.*;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Foto {
	
	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "foto_seq")
	@SequenceGenerator(name = "foto_seq", sequenceName = "foto_seq", initialValue = 1, allocationSize = 1)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "pessoa_id")
	@NotNull(message = "Pessoa é obrigatória")
	private Pessoa pessoa;
	
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Tipo foto é obrigatório")
	private TipoFoto tipoFoto;
	
	@Size(min = 3, max = 100, message = "Nome do arquivo deve ter entre {min} e {max} caracteres")
	@NotEmpty(message = "Nome do arquivo é obrigatório")
	private String nomeArquivo;
	
	@Size(min = 3, max = 150, message = "Descrição deve ter entre {min} e {max} caracteres")
	@NotEmpty(message = "Descrição é obrigatório")
	private String descricao;
	
	@Enumerated(EnumType.STRING)
	@NotNull(message = "Tipo conteúdo é obrigatório")
	private TipoConteudo tipoConteudo;
	
	@NotNull(message = "Tamanho é obrigatório")
	private long tamanho;

	private String link;

}
