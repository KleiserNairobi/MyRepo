package br.com.chamai.resources;

import br.com.chamai.models.Moeda;
import br.com.chamai.services.MoedaService;
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
@RequestMapping("/moedas")
@Api(value = "moedas")
public class MoedaResource {

    @Autowired
    private MoedaService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de moedas")
    public ResponseEntity<List<Moeda>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna uma moeda")
    public ResponseEntity<Moeda> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PostMapping
    @ApiOperation(value = "Insere uma moeda")
    public ResponseEntity<Moeda> insert(@Valid @RequestBody Moeda entity) {
        Moeda savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera uma moeda")
    public ResponseEntity<Void> update(@Valid @RequestBody Moeda entity, @PathVariable Long id) {
        service.update(entity, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui uma moeda")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
