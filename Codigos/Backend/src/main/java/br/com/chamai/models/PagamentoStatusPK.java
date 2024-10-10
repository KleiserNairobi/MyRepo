package br.com.chamai.models;

import lombok.*;
import java.io.Serializable;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoStatusPK implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long pagamento;
    private Long id;

}
