package br.com.chamai.models;

import br.com.chamai.models.enums.TipoPagamento;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity @Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pagamento_seq")
    @SequenceGenerator(
            name = "pagamento_seq",
            sequenceName = "pagamento_seq",
            initialValue = 1,
            allocationSize = 1
    )
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "entrega_id")
    private Entrega entrega;

    @ManyToOne
    @JoinColumn(name = "gateway_id")
    private Gateway gateway;

    @ManyToOne
    @JoinColumn(name = "tabela_preco_id")
    private TabelaPreco tabelaPreco;

    private Long gatewayIdPagamento;

    private Long gatewayIdDevolucao;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Tipo de pagamento é obrigatório")
    private TipoPagamento tipoPgto;

    @NotNull(message = "Valor do percurso é obrigatório")
    private Float valorPercurso;

    @NotNull(message = "Valor do produto é obrigatório")
    private Float valorProduto;

    @ManyToOne
    @JoinColumn(name = "desconto_id")
    private Desconto desconto;

    @NotNull(message = "Valor do desconto é obrigatório")
    private Float valorDesconto;

    private Float total;

    private String observacao;

}
