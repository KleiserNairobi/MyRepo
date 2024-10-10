package br.com.chamai.services;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import br.com.chamai.models.dto.PagamentoObsDto;
import br.com.chamai.util.gateways.mercadopago.MercadoPagoService;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Agendamento;
import br.com.chamai.models.Desconto;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.Gateway;
import br.com.chamai.models.Pagamento;
import br.com.chamai.models.PagamentoStatus;
import br.com.chamai.models.TabelaPreco;
import br.com.chamai.models.dto.PagamentoDto;
import br.com.chamai.models.enums.StatusPagamento;
import br.com.chamai.models.enums.TipoPagamento;
import br.com.chamai.repositories.PagamentoRepository;

@Service
public class PagamentoService {

    @Autowired private PagamentoRepository repository;
    @Autowired private PagamentoStatusService pgtoStatusService;
    @Autowired private EntregaService entregaService;
    @Autowired private GatewayService gatewayService;
    @Autowired private TabelaPrecoService tabelaPrecoService;
    @Autowired private DescontoService descontoService;
    @Autowired private AgendamentoService agendamentoService;
    @Autowired private MercadoPagoService mpService;

    public List<Pagamento> findAll() {
        return repository.findAll();
    }

    public Pagamento find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de entrega pagamento com o id " + id)
        );
    }
    
    public Optional<Pagamento> findByEntrega(Entrega entrega) {
    	return repository.findByEntrega(entrega);
    }
    
    public Optional<Pagamento> findByAgendamento(Agendamento agendamento) {
    	return repository.findByAgendamento(agendamento);
    }

    @Transactional
    public Pagamento insert(Pagamento entity) throws MPException {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
        }
        if (entity.getDesconto() == null && entity.getValorDesconto() > 0) {
            throw new ExcecaoTempoExecucao("Foi informado um valor de desconto sem informar o cupom.");
        }

        Pagamento novoPagamento = repository.save(entity);
        inseriStatusPagamento(novoPagamento);
        return novoPagamento;
    }

    @Transactional
    public Pagamento update(Pagamento entity, Long id) {
        Pagamento pagamento = find(id);
        BeanUtils.copyProperties(entity, pagamento, "id");
        return repository.save(pagamento);
    }

    @Transactional
    public Pagamento updateObservacao(PagamentoObsDto entity, Long id) {
        Pagamento pagamento = find(id);
        pagamento.setObservacao(entity.getObservacao());
        return repository.save(pagamento);
    }

//    @Transactional
//    public Pagamento devolve(Long id) throws MPException {
//        Pagamento pagamento = find(id);
//        Gateway gateway = gatewayService.find(pagamento.getGateway().getId());
//        String idDevolucao = mpService.devolve(pagamento.getGatewayIdPagamento(), gateway.getChave(), gateway.getToken());
//        pagamento.setGatewayIdDevolucao(Long.valueOf(idDevolucao));
//        return repository.save(pagamento);
//    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

    private void inseriStatusPagamento(Pagamento novoPagamento) throws MPException {
        PagamentoStatus pgtoStatus = new PagamentoStatus();
        pgtoStatus.setPagamento(novoPagamento);
        pgtoStatus.setData(LocalDate.now());
        pgtoStatus.setHora(Time.valueOf(LocalTime.now()));
        pgtoStatus.setStatus(StatusPagamento.I);
        pgtoStatusService.insert(pgtoStatus);

        if (novoPagamento.getTipoPgto().equals(TipoPagamento.D)) {
            PagamentoStatus pgtoStatus1 = new PagamentoStatus();
            pgtoStatus1.setPagamento(novoPagamento);
            pgtoStatus1.setData(LocalDate.now());
            pgtoStatus1.setHora(Time.valueOf(LocalTime.now()));
            pgtoStatus1.setStatus(StatusPagamento.A);
            pgtoStatusService.insert(pgtoStatus1);
        }
    }

    public Pagamento fromDtoToEntity(PagamentoDto pagamentoDto) {
        Float total = pagamentoDto.getValorPercurso() +
                pagamentoDto.getValorProduto() -
                pagamentoDto.getValorDesconto();

        Pagamento pagamento = new Pagamento();

        if (pagamentoDto.getAgendamento() != null) {
            Agendamento agendamento= agendamentoService.find(pagamentoDto.getAgendamento());
            pagamento.setAgendamento(agendamento);
        } else {
            pagamento.setAgendamento(null);
        }

        if (pagamentoDto.getEntrega() != null) {
            Entrega entrega = entregaService.find(pagamentoDto.getEntrega());
            pagamento.setEntrega(entrega);
        } else {
            pagamento.setEntrega(null);
        }

        TabelaPreco tabelaPreco = tabelaPrecoService.find(pagamentoDto.getTabelaPreco());
        pagamento.setTabelaPreco(tabelaPreco);

        if (pagamentoDto.getGateway() != null) {
            Gateway gateway = gatewayService.find(pagamentoDto.getGateway());
            pagamento.setGateway(gateway);
        } else {
            pagamento.setGateway(null);
        }

        if (pagamentoDto.getDesconto() != null) {
            Desconto desconto = descontoService.find(pagamentoDto.getDesconto());
            pagamento.setDesconto(desconto);
        } else {
            pagamento.setDesconto(null);
        }

        pagamento.setGatewayIdPagamento(pagamentoDto.getGatewayIdPagamento());
        pagamento.setTipoPgto(pagamentoDto.getTipoPgto());
        pagamento.setValorPercurso(pagamentoDto.getValorPercurso());
        pagamento.setValorProduto(pagamentoDto.getValorProduto());
        pagamento.setValorDesconto(pagamentoDto.getValorDesconto());
        pagamento.setTotal(total);

        if (!StringUtils.isEmpty(pagamentoDto.getObservacao())) {
            pagamento.setObservacao(pagamentoDto.getObservacao().toUpperCase());
        }

        return pagamento;
    }

}
