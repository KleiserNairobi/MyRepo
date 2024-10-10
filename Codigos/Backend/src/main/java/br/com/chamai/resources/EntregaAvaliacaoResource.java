package br.com.chamai.resources;

import br.com.chamai.models.EntregaAvaliacao;
import br.com.chamai.services.EntregaAvaliacaoService;
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
@RequestMapping("/entrega-avaliacoes")
@Api(value = "Entregas Avaliações")
public class EntregaAvaliacaoResource {

    @Autowired
    private EntregaAvaliacaoService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de avaliações de entrega")
    public ResponseEntity<List<EntregaAvaliacao>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna uma avaliação de entrega")
    public ResponseEntity<EntregaAvaliacao> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PostMapping
    @ApiOperation(value = "Insere uma avaliação de entrega")
    public ResponseEntity<EntregaAvaliacao> insert(@Valid @RequestBody EntregaAvaliacao entity) {
        EntregaAvaliacao savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera uma avaliação de entrega")
    public ResponseEntity<EntregaAvaliacao> update(@Valid @RequestBody EntregaAvaliacao entity, @PathVariable Long id) {
        service.update(entity, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui uma avaliação de entrega")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
