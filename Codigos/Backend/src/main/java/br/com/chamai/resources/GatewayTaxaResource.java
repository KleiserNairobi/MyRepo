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
import br.com.chamai.models.GatewayTaxa;
import br.com.chamai.services.GatewayTaxaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/gateway-taxas")
@Api(value = "Gateway taxas")
public class GatewayTaxaResource {

	@Autowired private GatewayTaxaService service;
	@Autowired private ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de gateway taxa")
	public ResponseEntity<List<GatewayTaxa>> findAll() {
		return ResponseEntity.ok(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um gateway taxa")
	public ResponseEntity<GatewayTaxa> find(@PathVariable Long id) {
		return ResponseEntity.ok(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere um gateway taxa")
	public ResponseEntity<GatewayTaxa> insert(@Valid @RequestBody GatewayTaxa entity, HttpServletResponse response) {
		GatewayTaxa savedEntity = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEntity.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um gateway taxa")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody GatewayTaxa entity, @PathVariable Long id) {
		service.update(entity, id);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Remove um gateway taxa")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}
	
}
