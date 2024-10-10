package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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

import br.com.chamai.models.Banco;
import br.com.chamai.repositories.filters.BancoFilter;
import br.com.chamai.services.BancoService;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/bancos")
@Api(value = "Bancos Brasileiros")
public class BancoResource {

	@Autowired BancoService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de bancos")
	public ResponseEntity<List<Banco>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/page")
	@ApiOperation(value = "Retorna uma lista paginada de bancos")
	public Page<Banco> findPage(BancoFilter filter, Pageable pageable) {
		return service.findPage(filter, pageable);
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um banco")
	public ResponseEntity<Banco> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um banco")
	public ResponseEntity<Banco> insert(@Valid @RequestBody Banco entity) {
		Banco savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um banco")
	public ResponseEntity<Banco> update(@Valid @RequestBody Banco entity, @PathVariable Long id) {
		service.update(entity, id);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um banco")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
