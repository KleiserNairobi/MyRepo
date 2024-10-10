package br.com.chamai.resources;

import br.com.chamai.models.BancoTaxa;
import br.com.chamai.services.BancoTaxaService;
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
@RequestMapping("/banco-taxas")
@Api(value = "Banco-Taxas")
public class BancoTaxaResource {

    @Autowired
    private BancoTaxaService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de taxas bancárias")
    public ResponseEntity<List<BancoTaxa>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna uma taxa bancária")
    public ResponseEntity<BancoTaxa> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PostMapping
    @ApiOperation(value = "Insere uma taxa bancária")
    public ResponseEntity<BancoTaxa> insert(@Valid @RequestBody BancoTaxa entity) {
        BancoTaxa savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera uma taxa bancária")
    public ResponseEntity<BancoTaxa> update(@Valid @RequestBody BancoTaxa entity, @PathVariable Long id) {
        service.update(entity, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui uma taxa bancária")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
