package br.com.chamai.resources;

import br.com.chamai.models.Entrega;
import br.com.chamai.models.EntregaStatus;
import br.com.chamai.models.dto.EntregaStatusDto;
import br.com.chamai.services.EntregaStatusService;
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
@RequestMapping("/entregas-status")
@Api(value = "Entregas Status")
public class EntregaStatusResource {

    @Autowired
    private EntregaStatusService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de status de entrega")
    public ResponseEntity<List<EntregaStatus>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{entrega}")
    @ApiOperation(value = "Retorna os status de uma entrega")
    public ResponseEntity<List<EntregaStatus>> findByEntrega(@PathVariable Entrega entrega) {
        return ResponseEntity.ok().body(service.findByEntrega(entrega));
    }

    @GetMapping("/{entrega}/{id}")
    @ApiOperation(value = "Retorna um status de entrega")
    public ResponseEntity<EntregaStatus> find(@PathVariable Long entrega, @PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(entrega, id));
    }

    @GetMapping("/{idEntrega}/ultimo-status")
    @ApiOperation(value = "Retorna o último status de uma entrega")
    public ResponseEntity<EntregaStatusDto> findUltimoStatus(@PathVariable Long idEntrega) {
        return ResponseEntity.ok().body(service.getUltimoStatus(idEntrega));
    }

    @PostMapping
    @ApiOperation(value = "Insere um status de entrega")
    public ResponseEntity<EntregaStatus> insert(@Valid @RequestBody EntregaStatus entity) {
        EntregaStatus savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{entrega}/{id}")
    @ApiOperation(value = "Altera um status de entrega")
    public ResponseEntity<EntregaStatus> update(
            @Valid @RequestBody EntregaStatus entity,
            @PathVariable Long entrega,
            @PathVariable Long id) {
        EntregaStatus savedEntity = service.update(entity, entrega, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

    @DeleteMapping("/{entrega}/{id}")
    @ApiOperation(value = "Exclui um status de entrega")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long entrega, @PathVariable Long id) {
        service.delete(entrega, id);
    }

}
