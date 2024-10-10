package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;

import br.com.chamai.models.ContaReceber;
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

import br.com.chamai.services.ContaReceberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/contas-receber")
@Api(value = "Conta a Receber")
public class ContaReceberResource {

	@Autowired ContaReceberService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de recebimentos")
	public ResponseEntity<List<ContaReceber>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um recebimento")
	public ResponseEntity<ContaReceber> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma recebimento")
	public ResponseEntity<ContaReceber> insert(@Valid @RequestBody ContaReceber entity) {
		ContaReceber savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um recebimento")
	public ResponseEntity<ContaReceber> update(@Valid @RequestBody ContaReceber entity, @PathVariable Long id) {
		ContaReceber savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um recebimento")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
