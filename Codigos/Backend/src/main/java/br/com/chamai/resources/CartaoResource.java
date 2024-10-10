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
import br.com.chamai.models.Cartao;
import br.com.chamai.services.CartaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/cartoes")
@Api(value = "Cartões")
public class CartaoResource {

	@Autowired CartaoService service;
	@Autowired ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de cartões")
	public ResponseEntity<List<Cartao>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um cartão")
	public ResponseEntity<Cartao> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um cartão")
	public ResponseEntity<Cartao> insert(@Valid @RequestBody Cartao entity, HttpServletResponse response) {
		Cartao savedEnity = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEnity.getId()));
		return ResponseEntity.ok(savedEnity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um cartão")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody Cartao entity, @PathVariable Long id) {
		service.update(entity, id);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Remove um cartão")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
	
}
