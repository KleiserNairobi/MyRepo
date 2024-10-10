package br.com.chamai.resources;

import br.com.chamai.models.Pagamento;
import br.com.chamai.models.PagamentoStatus;
import br.com.chamai.models.dto.PagamentoStatusDto;
import br.com.chamai.services.PagamentoStatusService;
import com.mercadopago.exceptions.MPException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/pagamentos-status")
@Api(value = "Pagamentos Status")
public class PagamentoStatusResource {

    @Autowired
    private PagamentoStatusService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de status de pagamento")
    public ResponseEntity<List<PagamentoStatus>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{pagamento}")
    @ApiOperation(value = "Retorna os status de um pagamento")
    public ResponseEntity<List<PagamentoStatus>> findByPagamento(@PathVariable Pagamento pagamento) {
        return ResponseEntity.ok().body(service.findByPagamento(pagamento));
    }

    @GetMapping("/{pagamento}/{id}")
    @ApiOperation(value = "Retorna um status de pagamento")
    public ResponseEntity<PagamentoStatus> find(@PathVariable Long pagamento, @PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(pagamento, id));
    }

    @GetMapping("/{idPagamento}/ultimo-status")
    @ApiOperation(value = "Retorna o último status de um pagamento")
    public ResponseEntity<PagamentoStatusDto> findUltimoStatus(@PathVariable Long idPagamento) {
        return ResponseEntity.ok().body(service.getUltimoStatus(idPagamento));
    }

    @PostMapping
    @ApiOperation(value = "Insere um status de pagamento")
    public ResponseEntity<PagamentoStatus> insert(@Valid @RequestBody PagamentoStatus entity) throws MPException {
        PagamentoStatus savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{pagamento}/{id}")
    @ApiOperation(value = "Altera um status de pagamento")
    public ResponseEntity<PagamentoStatus> update(
            @Valid @RequestBody PagamentoStatus entity,
            @PathVariable Long pagamento,
            @PathVariable Long id) {
        PagamentoStatus savedEntity = service.update(entity, pagamento, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

    @DeleteMapping("/{pagamento}/{id}")
    @ApiOperation(value = "Exclui um status de pagamento")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long pagamento, @PathVariable Long id) {
        service.delete(pagamento, id);
    }

}
