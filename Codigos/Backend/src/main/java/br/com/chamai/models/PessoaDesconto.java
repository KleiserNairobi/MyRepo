package br.com.chamai.models;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PessoaDesconto implements Serializable {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pessoa_desconto_seq")
    @SequenceGenerator(name = "pessoa_desconto_seq", sequenceName = "pessoa_desconto_seq", initialValue = 1, allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pessoa_id")
    private Pessoa pessoa;

    @ManyToOne
    @JoinColumn(name = "desconto_id")
    private Desconto desconto;

}
