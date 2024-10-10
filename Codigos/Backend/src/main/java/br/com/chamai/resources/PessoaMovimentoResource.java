package br.com.chamai.resources;

import br.com.chamai.models.PessoaMovimento;
import br.com.chamai.services.PessoaMovimentoService;
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
@RequestMapping("/pessoa-movimentacao")
@Api(value = "Pessoa-Movimento")
public class PessoaMovimentoResource {

    @Autowired
    private PessoaMovimentoService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de movimentação de pessoa")
    public ResponseEntity<List<PessoaMovimento>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna uma movimentação de pessoa")
    public ResponseEntity<PessoaMovimento> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PostMapping
    @ApiOperation(value = "Insere um conta")
    public ResponseEntity<PessoaMovimento> insert(@Valid @RequestBody PessoaMovimento entity) {
        PessoaMovimento savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera uma movimentação de pessoa")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void update(@Valid @RequestBody PessoaMovimento entity, @PathVariable Long id) {
        service.update(entity, id);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Remove uma movimentação de pessoa")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(Long id) {
        service.delete(id);
    }

}