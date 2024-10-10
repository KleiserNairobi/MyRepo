package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import java.util.Optional;
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
import br.com.chamai.models.Conta;
import br.com.chamai.services.ContaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/contas")
@Api(value = "Contas")
public class ContaResource {

	@Autowired ContaService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de contas - filtrado por pessoa")
	public ResponseEntity<List<Conta>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma conta")
	public ResponseEntity<Conta> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@GetMapping("/ativo/{idPessoa}")
	@ApiOperation(value = "Retorna a conta ativa de uma pessoa")
	public ResponseEntity <Conta> findAtivoByPessoa(@PathVariable Long idPessoa) {
		return ResponseEntity.ok().body(service.findAtivoByPessoa(idPessoa));
	}

	@PostMapping
	@ApiOperation(value = "Insere uma conta")
	public ResponseEntity<Conta> insert(@Valid @RequestBody Conta entity) {
		Conta savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma conta")
	public ResponseEntity<Void> update(@Valid @RequestBody Conta entity, @PathVariable Long id) {
		service.update(entity, id);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma conta")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
