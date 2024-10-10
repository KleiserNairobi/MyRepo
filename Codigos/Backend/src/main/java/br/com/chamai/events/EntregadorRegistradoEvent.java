package br.com.chamai.events;

import br.com.chamai.models.Pessoa;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EntregadorRegistradoEvent {
    private Pessoa entregador;
}
