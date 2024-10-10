package br.com.chamai.resources;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import br.com.chamai.models.dto.AprovacaoDto;
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
import br.com.chamai.models.Aprovacao;
import br.com.chamai.services.AprovacaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/aprovacoes")
@Api(value = "Aprovações")
public class AprovacaoResource {
	
	@Autowired AprovacaoService service;
	@Autowired private ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista aprovações")
	public ResponseEntity<List<Aprovacao>> findAll() {
		return ResponseEntity.ok(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma aprovação")
	public ResponseEntity<Aprovacao> find(@PathVariable Long id) {
		return ResponseEntity.ok(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma aprovação")
	public ResponseEntity<Aprovacao> insert(@Valid @RequestBody Aprovacao entity, HttpServletResponse response) {
		Aprovacao savedEntity = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEntity.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma aprovação")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody Aprovacao entity, @PathVariable Long id) {
		service.update(entity, id);
	}

	@PutMapping("/altera-status/{id}")
	@ApiOperation(value = "Altera o status de uma aprovação")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void updateStatus(@Valid @RequestBody AprovacaoDto entity, @PathVariable Long id) {
		service.updateStatus(entity, id);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Remove uma aprovação")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(id);
	}

}
