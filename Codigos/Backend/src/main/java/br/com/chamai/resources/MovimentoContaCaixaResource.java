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

import br.com.chamai.models.MovimentoContaCaixa;
import br.com.chamai.services.MovimentoContaCaixaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/movimento-conta-caixas")
@Api(value = "Movimento conta caixas")
public class MovimentoContaCaixaResource {
	
	@Autowired private MovimentoContaCaixaService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de movimento conta caixa")
	public ResponseEntity<List<MovimentoContaCaixa>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um movimento conta caixa")
	public ResponseEntity<MovimentoContaCaixa> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um movimento conta caixa")
	public ResponseEntity<MovimentoContaCaixa> insert(@Valid @RequestBody MovimentoContaCaixa entity) {
		MovimentoContaCaixa savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um movimento conta caixa")
	public ResponseEntity<MovimentoContaCaixa> update(@Valid @RequestBody MovimentoContaCaixa entity, @PathVariable Long id) {
		MovimentoContaCaixa savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um movimento conta caixa")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

}
