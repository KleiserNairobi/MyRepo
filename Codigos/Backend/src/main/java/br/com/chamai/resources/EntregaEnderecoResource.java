package br.com.chamai.resources;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import br.com.chamai.models.Entrega;
import br.com.chamai.services.EntregaService;
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
import br.com.chamai.models.EntregaEndereco;
import br.com.chamai.services.EntregaEnderecoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/entrega-enderecos")
@Api(value = "Entregas endereços")
public class EntregaEnderecoResource {
	
	@Autowired EntregaEnderecoService service;
	@Autowired EntregaService entregaService;
	@Autowired ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de endereços de entrega")
	public ResponseEntity<List<EntregaEndereco>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um endereço de entrega")
	public ResponseEntity<EntregaEndereco> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@GetMapping("/entrega/{idEntrega}")
	@ApiOperation(value = "Retorna os endereços de uma entrega")
	public ResponseEntity<List<EntregaEndereco>> findByEntrega(@PathVariable Long idEntrega ) {
		return ResponseEntity.ok().body(service.findByEntrega(idEntrega));
	}

	@PostMapping
	@ApiOperation(value = "Insere um endereço de entrega")
	public ResponseEntity<EntregaEndereco> insert(@Valid @RequestBody EntregaEndereco entity, HttpServletResponse response) {
		EntregaEndereco savedEnity = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEnity.getId()));
		return ResponseEntity.ok(savedEnity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um endereço de entrega")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody EntregaEndereco entity, @PathVariable Long id) {
		service.update(entity, id);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Remove um endereço de entrega")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}

}
