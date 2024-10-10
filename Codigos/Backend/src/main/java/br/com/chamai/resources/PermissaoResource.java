package br.com.chamai.resources;

import javax.validation.Valid;

import br.com.chamai.models.Banco;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.chamai.models.Permissao;
import br.com.chamai.services.PermissaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/permissoes")
@Api(value = "Permissões")
public class PermissaoResource {

	@Autowired PermissaoService service;

	@GetMapping
	@ApiOperation(value = "Retorna uma lista de permissões")
	public ResponseEntity<List<Permissao>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma permissão")
	public ResponseEntity<Permissao> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@PostMapping
	@ApiOperation(value = "Insere uma permissão")
	public ResponseEntity<Permissao> insert(@Valid @RequestBody Permissao entity) {
		Permissao savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma permissão")
	public ResponseEntity<Permissao> update(@Valid @RequestBody Permissao entity, @PathVariable Long id) {
		Permissao savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma permissão")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

}
