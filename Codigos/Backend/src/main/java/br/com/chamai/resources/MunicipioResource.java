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

import br.com.chamai.models.Municipio;
import br.com.chamai.repositories.filters.MunicipioFilter;
import br.com.chamai.services.MunicipioService;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/municipios")
@Api(value = "Municípios Brasileiros")
public class MunicipioResource {

	@Autowired MunicipioService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de municípios")
	public ResponseEntity<List<Municipio>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/page")
	@ApiOperation(value = "Retorna uma lista paginada de municípios")
	public Page<Municipio> findPage(MunicipioFilter filter, Pageable pageable) {
		return service.findPage(filter, pageable);
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um município")
	public ResponseEntity<Municipio> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@GetMapping("/estado/{uf}")
	@ApiOperation(value = "retorna uma lista de municípios de um estado ")
	public ResponseEntity<List<Municipio>> listByEstado(@PathVariable String uf) {
		List<Municipio> municipios = service.listByEstado(uf);
		return ResponseEntity.ok(municipios);
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um municipio")
	public ResponseEntity<Municipio> insert(@Valid @RequestBody Municipio entity) {
		Municipio savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um município")
	public ResponseEntity<Void> update(@Valid @RequestBody Municipio entity, @PathVariable Long id) {
		service.update(entity, id);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um município")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
