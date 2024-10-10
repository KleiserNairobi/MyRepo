package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;
import br.com.chamai.models.DadosPagamentoCartao;
import br.com.chamai.models.Gateway;
import br.com.chamai.models.dto.PagamentoDto;
import br.com.chamai.models.dto.PagamentoObsDto;
import br.com.chamai.models.enums.TipoGateway;
import br.com.chamai.services.GatewayService;
import br.com.chamai.util.gateways.mercadopago.MercadoPagoService;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import br.com.chamai.models.Pagamento;
import br.com.chamai.services.PagamentoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/pagamentos")
@Api(value = "Pagamentos")
public class PagamentoResource {

    @Autowired private PagamentoService service;
    @Autowired private MercadoPagoService mpService;
    @Autowired private GatewayService gatewayService;

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna o pagamento de uma entrega")
    public ResponseEntity<Pagamento> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de pagamentos de entregas")
    public ResponseEntity<List<Pagamento>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @PostMapping
    @ApiOperation(value = "Insere o pagamento de uma entrega")
    public ResponseEntity<Pagamento> insert(@Valid @RequestBody PagamentoDto entity) throws MPException {
        Pagamento savedEntity = service.fromDtoToEntity(entity);
        savedEntity = service.insert(savedEntity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera o pagamento de uma entrega")
    public ResponseEntity<Pagamento> update(@Valid @RequestBody Pagamento entity, @PathVariable Long id) {
        Pagamento savedEntity = service.update(entity, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

    @PutMapping("/{id}/observacao")
    @ApiOperation(value = "Insere observação em um pagamento")
    public ResponseEntity<Pagamento> updateObservacao(
            @Valid
            @RequestBody PagamentoObsDto entity,
            @PathVariable Long id
    ) {
        Pagamento savedEntity = service.updateObservacao(entity, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

//    @PutMapping("/{id}/devolve")
//    @ApiOperation(value = "Procede a devolução do montante pago em uma entrega")
//    public ResponseEntity<Pagamento> devolve(@PathVariable Long id) throws MPException {
//        Pagamento savedEntity = service.devolve(id);
//        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
//    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui o pagamento de uma entrega")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    @ApiOperation(value = "Checkout cartão de crédito - tipo transparente")
    public ResponseEntity<?> checkout(@Valid @RequestBody DadosPagamentoCartao entity) throws MPException {
        String pagamento = "";
        Gateway gateway = gatewayService.find(entity.getIdGateway());
        TipoGateway tipoGateway = gateway.getTipoGateway();
        switch (tipoGateway) {
            case IG: // Instruções para Iugu
                break;
            case MP: // Instruções para MercadoPago
                pagamento = mpService.processa(entity, gateway.getChave(), gateway.getToken());
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
        //return ResponseEntity.ok(pagamento);
        return ResponseEntity.status(HttpStatus.OK).body(pagamento);
    }

}
