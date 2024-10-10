package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.*;
import br.com.chamai.models.dto.PagamentoStatusDto;
import br.com.chamai.models.enums.*;
import br.com.chamai.repositories.PagamentoStatusRepository;
import br.com.chamai.util.gateways.mercadopago.MercadoPagoService;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class PagamentoStatusService {

    @Autowired private PagamentoStatusRepository repository;
    @Autowired private PagamentoService pagamentoService;
    @Autowired private PessoaService pessoaService;
    @Autowired private EntregaService entregaService;
    @Autowired private GatewayService gatewayService;
    @Autowired private GatewayTaxaService gatewayTaxaService;
    @Autowired private MoedaService moedaService;
    @Autowired private PessoaMovimentoService pessoaMovimentoService;
    @Autowired private CategoriaService categoriaService;
    @Autowired private ParametroService parametroService;
    @Autowired private ContaPagarService contaPagarService;
    @Autowired private ParcelaContaPagarService parcelaContaPagarService;
    @Autowired private ContaReceberService contaReceberService;
    @Autowired private ParcelaContaReceberService parcelaContaReceberService;
    @Autowired private MercadoPagoService mpService;

    public List<PagamentoStatus> findAll() {
        return repository.findAll();
    }

    public List<PagamentoStatus> findByPagamento(Pagamento pagamento) {
        return repository.findByPagamento(pagamento);
    }

    public PagamentoStatus find(Long pagamento, Long id) {
        PagamentoStatusPK pagamentoStatusPK = PagamentoStatusPK.builder().pagamento(pagamento).id(id).build();
        return repository.findById(pagamentoStatusPK).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de status de pagamento " + pagamento + "/" + id)
        );
    }

    public PagamentoStatusDto getUltimoStatus(Long idPagamento) {
        Optional<PagamentoStatus> pagamentoStatus = Optional.ofNullable(
                repository.getUltimoStatus(idPagamento)
                .orElseThrow(
                () -> new EntidadeNaoEncontrada(
                        "Não existe status para o pagamento de código " + idPagamento
                )
        ));
        PagamentoStatusDto dto = new PagamentoStatusDto();
        dto.setIdPagamento(pagamentoStatus.get().getPagamento().getId());
        dto.setId(pagamentoStatus.get().getId());
        dto.setData(pagamentoStatus.get().getData());
        dto.setHora(pagamentoStatus.get().getHora());
        dto.setStatus(getStatus(pagamentoStatus.get().getStatus()));
        dto.setDescricaoStatus(pagamentoStatus.get().getStatus().toString());
        return dto;
    }

    @Transactional
    public PagamentoStatus insert(PagamentoStatus entity) throws MPException {
        if (entity.getPagamento() == null || entity.getPagamento().getId() == null) {
            throw new EntidadeNaoEncontrada("Pagamento não informado");
        }

        entity.setId(getNovoId(entity.getPagamento().getId()));
        entity.setData(LocalDate.now());
        entity.setHora(Time.valueOf(LocalTime.now()));
        repository.save(entity);

        if (entity.getStatus().equals(StatusPagamento.E)) {
            Long idPagar;
            Long idReceber;
            Pagamento pagamento = pagamentoService.find(entity.getPagamento().getId());
            Entrega entrega = pagamento.getEntrega();
            Pessoa cliente = pessoaService.find(entrega.getCliente().getId());
            Pessoa entregador = pessoaService.find(entrega.getEntregador().getId());

            // Lançando conta a receber no valor total
            idReceber = setContaAReceber(cliente, entrega.getId(), getTotalAplicativo(pagamento), pagamento.getTipoPgto());

            // Repassando o valor do produto a pessoa jurídica
            if (cliente.getTipo().equals(TipoPessoa.J) && cliente.getParceiro()) {
                if (pagamento.getValorProduto() != null) {
                    idPagar = setContaAPagar(cliente, entrega.getId(), getValorParceiro(pagamento), pagamento.getTipoPgto());
                    setMovimentacao(cliente, entrega.getId(), OperacaoPessoaMovimento.C,
                            getValorParceiro(pagamento).doubleValue(), montaHistorico(pagamento, idPagar, "PAGAR")
                    );
                    setMovimentacao(cliente, entrega.getId(), OperacaoPessoaMovimento.D,
                            getValorTaxaAdm(pagamento).doubleValue(), montaHistorico(pagamento, idPagar, "PAGAR-TAXA-ADM")
                    );
                }
            }

            // Repassando o valor do entregador
            idPagar = setContaAPagar(entregador, entrega.getId(), getValorEntregador(pagamento), pagamento.getTipoPgto());
            setMovimentacao(entregador, entrega.getId(), OperacaoPessoaMovimento.C,
                    getValorEntregador(pagamento).doubleValue(), montaHistorico(pagamento, idPagar, "PAGAR")
            );

            // Descontando do entregador o valor do aplicativo
            if (pagamento.getTipoPgto().equals(TipoPagamento.D)) {
                setMovimentacao(entregador, entrega.getId(), OperacaoPessoaMovimento.D,
                        getValorAplicativo(pagamento).doubleValue(), montaHistorico(pagamento, idReceber, "RECEBER")
                );
            }
        }

        // Se for uma devolução de pagamento por cartão de crédito
        if (entity.getStatus().equals(StatusPagamento.DEV)) {
            Pagamento pagamento = pagamentoService.find(entity.getPagamento().getId());
            if (pagamento.getTipoPgto().equals(TipoPagamento.CC)) {
                String idDevolucao = null;
                Long gatewayIdPagamento = pagamento.getGatewayIdPagamento();
                Gateway gateway = gatewayService.find(pagamento.getGateway().getId());
                TipoGateway tipoGateway = gateway.getTipoGateway();
                switch (tipoGateway) {
                    case IG: // Instruções para Iugu
                        break;
                    case MP: // Instruções para MercadoPago
                        idDevolucao = mpService.devolve(gatewayIdPagamento, gateway.getChave(), gateway.getToken());
                        break;
                    case PM: // Instruções para Pagar.me
                        break;
                    case PP: // Instruções para PicPay
                        break;
                    case PS: // Instruções para PagSeguro
                        break;
                    case WC: // Instruções para WireCard
                        break;
                }
                if (idDevolucao != null) {
                    pagamento.setGatewayIdDevolucao(Long.valueOf(idDevolucao));
                    pagamentoService.update(pagamento, pagamento.getId());
                }
            }
        }

        return entity;
    }

    @Transactional
    public PagamentoStatus update(PagamentoStatus entity, Long idPagamento, Long id) {
        PagamentoStatus pagamentoStatus = find(idPagamento, id);
        BeanUtils.copyProperties(entity, pagamentoStatus, "pagamento", "id");
        return repository.save(pagamentoStatus);
    }

    @Transactional
    public void delete(Long pagamento, Long id) {
        find(pagamento, id);
        PagamentoStatusPK pagamentoStatusPK = PagamentoStatusPK.builder().pagamento(pagamento).id(id).build();
        repository.deleteById(pagamentoStatusPK);
    }

    private String getStatus(StatusPagamento statusPagamento) {
        String status = null;
        switch (statusPagamento) {
            case I: status = "I"; break;
            case N: status = "N"; break;
            case A: status = "A"; break;
            case E: status = "E"; break;
            case NRE: status = "NRE"; break;
            case TCP: status = "TCP"; break;
            case TCC: status = "TCC"; break;
            case DEV: status = "DEV"; break;
            case EST: status = "EST"; break;

        }
        return status;
    }

    public Long getNovoId(long idPagamento) {
        PagamentoStatus pagamentoStatus = repository.getUltimoID(idPagamento);
        if (pagamentoStatus == null) {
            return 1L;
        } else {
            return pagamentoStatus.getId() + 1;
        }
    }

    private Float getTotalAplicativo(Pagamento entity) {
        return entity.getValorPercurso() + entity.getValorProduto() - entity.getValorDesconto();
    }

    private Float getValorAplicativo(Pagamento entity) {
        Parametro param = parametroService.find(1L);
        Float percAplicativo = param.getPercentualAplicativo();
        if (percAplicativo != null && percAplicativo > 0) {
            return ((entity.getValorPercurso() - entity.getValorDesconto()) * percAplicativo) / 100;
        } else {
            return 0F;
        }
    }

    private Float getValorEntregador(Pagamento entity) {
        Parametro param = parametroService.find(1L);
        Float percEntregador = param.getPercentualEntregador();
        if (percEntregador != null && percEntregador > 0) {
            return (entity.getValorPercurso() * percEntregador) / 100;
        } else {
            return 0F;
        }
    }

    private Float getValorParceiro(Pagamento entity) {
        return entity.getValorProduto();
    }

    private Float getValorTaxaAdm(Pagamento entity) {
        GatewayTaxa taxaEmVigor = gatewayTaxaService.getTaxaEmVigor(entity.getGateway().getId());
        Float taxa = taxaEmVigor.getTaxaAdministrativa().floatValue();
        return (entity.getValorProduto() * taxa) / 100;
    }

    private Long setContaAReceber(Pessoa pessoa, Long idDocumento, Float valor, TipoPagamento tipoPgto) {
        Categoria categoria = categoriaService.find((long) 2);

        ContaReceber contaReceber = new ContaReceber();
        contaReceber.setPessoa(pessoa);
        contaReceber.setCategoria(categoria);
        contaReceber.setMoeda(getMoeda(tipoPgto));
        contaReceber.setOrigem(OrigemReceber.E);
        contaReceber.setDocumento(idDocumento.toString());
        contaReceber.setParcelas((byte) 1);
        contaReceber.setEmissao(LocalDate.now());
        contaReceber.setPrimeiroVcto(LocalDate.now().plusDays(30));
        contaReceber.setValorTotal(valor.doubleValue());
        contaReceber.setValorReceber(valor.doubleValue());
        ContaReceber novoContaReceber = contaReceberService.insert(contaReceber);

        ParcelaContaReceber parcelaContaReceber = new ParcelaContaReceber();
        parcelaContaReceber.setContaReceber(novoContaReceber);
        parcelaContaReceber.setId(parcelaContaReceberService.getNovoId(novoContaReceber.getId()));
        parcelaContaReceber.setDataEmissao(LocalDate.now());
        parcelaContaReceber.setDataVencimento(LocalDate.now().plusDays(30));
        parcelaContaReceber.setValor((double) valor);
        parcelaContaReceber.setTaxaJuro((double) 0);
        parcelaContaReceber.setTaxaMulta((double) 0);
        parcelaContaReceber.setTaxaDesconto((double) 0);
        parcelaContaReceber.setValorJuro((double) 0);
        parcelaContaReceber.setValorMulta((double) 0);
        parcelaContaReceber.setValorDesconto((double) 0);
        parcelaContaReceber.setDataRecebimento(null);
        parcelaContaReceber.setValorRecebimento((double) 0);
        parcelaContaReceberService.insert(parcelaContaReceber);
        return novoContaReceber.getId();
    }

    private Long setContaAPagar(Pessoa pessoa, Long idDocumento, Float valor, TipoPagamento tipoPgto) {
        Categoria categoria = categoriaService.find((long) 4);

        ContaPagar contaPagar = new ContaPagar();
        contaPagar.setPessoa(pessoa);
        contaPagar.setCategoria(categoria);
        contaPagar.setMoeda(getMoeda(tipoPgto));
        contaPagar.setOrigem(OrigemPagar.E);
        contaPagar.setDocumento(idDocumento.toString());
        contaPagar.setParcelas((byte) 1);
        contaPagar.setEmissao( LocalDate.now() );
        contaPagar.setPrimeiroVcto( LocalDate.now().plusDays(30) );
        contaPagar.setValorTotal(valor.doubleValue());
        contaPagar.setValorPagar(valor.doubleValue());
        ContaPagar novoContaPagar = contaPagarService.insert(contaPagar);

        ParcelaContaPagar parcelaContaPagar = new ParcelaContaPagar();
        parcelaContaPagar.setContaPagar(novoContaPagar);
        parcelaContaPagar.setId(parcelaContaPagarService.getNovoId(novoContaPagar.getId()));
        parcelaContaPagar.setDataEmissao(LocalDate.now());
        parcelaContaPagar.setDataVencimento(LocalDate.now().plusDays(30));
        parcelaContaPagar.setValor((double) valor);
        parcelaContaPagar.setTaxaJuro((double) 0);
        parcelaContaPagar.setTaxaMulta((double) 0);
        parcelaContaPagar.setTaxaDesconto((double) 0);
        parcelaContaPagar.setValorJuro((double) 0);
        parcelaContaPagar.setValorMulta((double) 0);
        parcelaContaPagar.setValorDesconto((double) 0);
        parcelaContaPagar.setDataPagamento(null);
        parcelaContaPagar.setValorPagamento((double) 0);
        parcelaContaPagarService.insert(parcelaContaPagar);
        return novoContaPagar.getId();
    }

    private void setMovimentacao(
            Pessoa pessoa,
            Long entrega_id,
            OperacaoPessoaMovimento operacao,
            Double valor,
            String historico
    ) {
        if (operacao.equals(OperacaoPessoaMovimento.D)) {
            valor = valor * -1;
        }

        PessoaMovimento movimento = new PessoaMovimento();
        movimento.setPessoa(pessoa);
        movimento.setOrigem(OrigemPessoaMovimento.E);
        movimento.setDocumento(entrega_id.toString());
        movimento.setOperacao(operacao);
        movimento.setData(LocalDate.now());
        movimento.setHora(LocalTime.now());
        movimento.setValor(valor);
        movimento.setQuitado(false);
        movimento.setHistorico(historico);
        pessoaMovimentoService.insert(movimento);
    }

    private String montaHistorico(Pagamento entity, Long codigo, String tipo) {
        Float total = entity.getValorPercurso() + entity.getValorProduto() - entity.getValorDesconto();

        String historico = "ENTREGA DE NÚMERO " + entity.getEntrega().getId().toString() +
                " NO VALOR DE TOTAL DE " + total.toString() + " REAIS";

        if (entity.getValorProduto() != null && entity.getValorProduto() > 0) {
            historico += ". AGREGADO PRODUTO NO VALOR DE " + entity.getValorProduto().toString();
        }
        if (entity.getValorDesconto() != null && entity.getValorDesconto() > 0) {
            historico += ". CONCEDIDO DESCONTO DE " + entity.getValorDesconto().toString();
        }

        historico += ". ORIGEM NA CONTA A " + tipo + " NÚMERO " + codigo.toString() + ".";
        return historico;
    }

    private Moeda getMoeda(TipoPagamento tipoPgto) {
        Moeda moeda = new Moeda();
        if (tipoPgto.equals(TipoPagamento.D)) {
            moeda = moedaService.find(1L);
        }
        if (tipoPgto.equals(TipoPagamento.CC)) {
            moeda = moedaService.find(2L);
        }
        if (tipoPgto.equals(TipoPagamento.CD)) {
            moeda = moedaService.find(3L);
        }
        return moeda;
    }

}
