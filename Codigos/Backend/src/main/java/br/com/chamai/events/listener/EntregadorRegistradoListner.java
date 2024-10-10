package br.com.chamai.events.listener;

import br.com.chamai.events.EntregadorRegistradoEvent;
import br.com.chamai.models.Aprovacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.enums.StatusAprovacao;
import br.com.chamai.services.AprovacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

//@Component
public class EntregadorRegistradoListner {

    @Autowired
    private AprovacaoService aprovacaoService;

    @TransactionalEventListener
    public void aoRegistrarEntregador(EntregadorRegistradoEvent event) {
        Pessoa pessoa = event.getEntregador();
        Aprovacao aprovacao = new Aprovacao();
        aprovacao.setPessoa(pessoa);
        aprovacao.setData(LocalDate.now());
        aprovacao.setHora(Time.valueOf(LocalTime.now()));
        aprovacao.setStatusAprovacao(StatusAprovacao.P);

        aprovacaoService.insert(aprovacao);
    }

}
