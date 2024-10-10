package br.com.chamai.resources;

import br.com.chamai.models.PessoaDesconto;
import br.com.chamai.services.PessoaDescontoService;
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
@RequestMapping("/pessoas-descontos")
@Api(value = "Pessoas Descontos")
public class PessoaDescontoResource {

    @Autowired
    PessoaDescontoService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de pessoas e descontos")
    public ResponseEntity<List<PessoaDesconto>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna pessoa-desconto, pesquisa por ID")
    public ResponseEntity<PessoaDesconto> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PostMapping
    @ApiOperation(value = "Insere pessoa-desconto")
    public ResponseEntity<PessoaDesconto> insert(@Valid @RequestBody PessoaDesconto entity) {
        PessoaDesconto savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);

    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera pessoa-desconto")
    public ResponseEntity<PessoaDesconto> update(@Valid @RequestBody PessoaDesconto entity, @PathVariable Long id) {
        PessoaDesconto savedEntity = service.update(entity, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui pessoa-desconto")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
