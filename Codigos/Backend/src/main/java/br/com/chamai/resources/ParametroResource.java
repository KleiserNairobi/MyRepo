package br.com.chamai.resources;

import br.com.chamai.models.Parametro;
import br.com.chamai.services.ParametroService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/parametros")
@Api(value = "Parâmetros")
public class ParametroResource {

    @Autowired
    private ParametroService service;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de parâmetros")
    public ResponseEntity<List<Parametro>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Retorna um parâmetro")
    public ResponseEntity<Parametro> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Altera um parâmetro")
    public ResponseEntity<Parametro> update(@Valid @RequestBody Parametro entity, @PathVariable Long id) {
        Parametro savedEntity = service.update(entity, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
    }

}
