package br.com.chamai.resources;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.chamai.events.RecursoCriadoEvent;
import br.com.chamai.models.Categoria;
import br.com.chamai.services.CategoriaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/categorias")
@Api(value = "Categorias")
public class CategoriaResource {
	
	@Autowired CategoriaService service;
	@Autowired ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de categorias")
	public ResponseEntity<List<Categoria>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma categoria")
	public ResponseEntity<Categoria> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma categoria")
	public ResponseEntity<Categoria> insert(@Valid @RequestBody Categoria entity, HttpServletResponse response) {
		Categoria savedCategoria = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedCategoria.getId()));
		return ResponseEntity.ok(savedCategoria);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma categoria")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody Categoria entity, @PathVariable Long id) {
		service.update(entity, id);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma categoria")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
