package br.com.chamai.resources;

import br.com.chamai.models.Habilitacao;
import br.com.chamai.models.Veiculo;
import br.com.chamai.services.HabilitacaoService;
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
import java.util.Optional;

@RestController
@RequestMapping("/habilitacoes")
@Api(value = "Habilitações")
public class HabilitacaoResource {

    @Autowired
    HabilitacaoService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de habilitações")
    public ResponseEntity<List<Habilitacao>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna uma habilitação, pesquisa por ID")
    public ResponseEntity<Habilitacao> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @GetMapping("/pessoa/{idPessoa}")
    @ApiOperation(value = "Retorna a habilitação de uma pessoa ")
    public ResponseEntity<Optional<Habilitacao>> findByPessoa(@PathVariable Long idPessoa) {
        Optional<Habilitacao> habilitacao = service.findByPessoa(idPessoa);
        return ResponseEntity.ok().body(habilitacao);
    }

    @PostMapping
    @ApiOperation(value = "Insere uma habilitação")
    public ResponseEntity<Habilitacao> insert(@Valid @RequestBody Habilitacao entity) {
        Habilitacao savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);

    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera uma habilitação")
    public ResponseEntity<Habilitacao> update(@Valid @RequestBody Habilitacao entity, @PathVariable Long id) {
        Habilitacao savedEntity = service.update(entity, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Exclui uma habilitação")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
