package br.com.chamai.resources;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.chamai.models.ContaCaixa;
import br.com.chamai.services.ContaCaixaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/conta-caixas")
@Api(value = "Conta caixas")
public class ContaCaixaResource {
	
	@Autowired private ContaCaixaService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de conta caixa")
	public ResponseEntity<List<ContaCaixa>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um conta caixa")
	public ResponseEntity<ContaCaixa> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um conta caixa")
	public ResponseEntity<ContaCaixa> insert(@Valid @RequestBody ContaCaixa entity) {
		ContaCaixa savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um conta caixa")
	public ResponseEntity<ContaCaixa> update(@Valid @RequestBody ContaCaixa entity, @PathVariable Long id) {
		ContaCaixa savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um conta caixa")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

}
