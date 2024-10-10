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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.chamai.models.ContaReceber;
import br.com.chamai.models.ParcelaContaReceber;
import br.com.chamai.services.ParcelaContaReceberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/parcelas-conta-receber")
@Api(value = "Parcelas conta receber")
public class ParcelaContaReceberResource {

	@Autowired
	ParcelaContaReceberService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de parcelas a receber")
	public ResponseEntity<List<ParcelaContaReceber>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{receber}")
	@ApiOperation(value = "Retorna as parcelas de uma conta a receber")
	public ResponseEntity<List<ParcelaContaReceber>> findByReceber(@PathVariable Long receber) {
		return ResponseEntity.ok().body(service.findByReceber(receber));
	}

	@GetMapping("/{receber}/{id}")
	@ApiOperation(value = "Retorna uma parcela a receber")
	public ResponseEntity<ParcelaContaReceber> find(@PathVariable Long receber, @PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(receber, id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma parcela a receber")
	public ResponseEntity<ParcelaContaReceber> insert(@Valid @RequestBody ParcelaContaReceber entity) {
		ParcelaContaReceber savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{receber}/{id}")
	@ApiOperation(value = "Altera uma parcela a receber")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void update(@Valid @RequestBody ParcelaContaReceber entity, @PathVariable Long receber, @PathVariable Long id) {
		service.update(entity, receber, id);
	}
	
	@DeleteMapping("/{receber}/{id}")
	@ApiOperation(value = "Exclui uma parcela a receber")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long receber, @PathVariable Long id) {
		service.delete(receber, id);
	}
	
	@PutMapping("/efetuar-recebimento")
	@ApiOperation(value = "Insere uma parcela a pagar")
	public ResponseEntity<ParcelaContaReceber> efetuarPagamento(@RequestBody ParcelaContaReceber entity) {
		ParcelaContaReceber savedEntity = service.efetuarRecebimento(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
}
