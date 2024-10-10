package br.com.chamai.resources;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import br.com.chamai.models.Estado;
import br.com.chamai.repositories.filters.EstadoFilter;
import br.com.chamai.services.EstadoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/estados")
@Api(value = "Unidades Federativas Brasileiras")
public class EstadoResource {

	@Autowired EstadoService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de estados")
	public ResponseEntity<List<Estado>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/page")
	@ApiOperation(value = "Retorna uma lista paginada de estados")
	public Page<Estado> findPage(EstadoFilter filter, Pageable pageable) {
		return service.findPage(filter, pageable);
	}
	
	@GetMapping("/{sigla}")
	@ApiOperation(value = "Retorna um estado")
	public ResponseEntity<Estado> find(@PathVariable String sigla) {
		return ResponseEntity.ok().body(service.find(sigla));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um estado")
	public ResponseEntity<Estado> insert(@Valid @RequestBody Estado entity) {
		Estado savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{sigla}").buildAndExpand(savedEntity.getSigla()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{sigla}")
	@ApiOperation(value = "Altera um estado")
	public ResponseEntity<Void> update(@Valid @RequestBody Estado entity, @PathVariable String sigla) {
		service.update(entity, sigla);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{sigla}")
	@ApiOperation(value = "Exclui um estado")
	public ResponseEntity<Void> delete(@PathVariable String sigla) {
		service.delete(sigla);
		return ResponseEntity.noContent().build();
	}
	
}
