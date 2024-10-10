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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.chamai.models.TabelaPreco;
import br.com.chamai.services.TabelaPrecoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/tabela-precos")
@Api(value = "Tabela de preços")
public class TabelaPrecoResource {

	@Autowired TabelaPrecoService service;
	

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma tabela de preço")
	public ResponseEntity<TabelaPreco> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de tabela de preços")
	public ResponseEntity<List<TabelaPreco>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma tabela de preço")
	public ResponseEntity<TabelaPreco> insert(@Valid @RequestBody TabelaPreco entity) {
		TabelaPreco savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PostMapping("/insert-parceiro-tabela-preco")
	@ApiOperation(value = "Vincula uma pessoa a uma tabela de preço")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void insertParceiroTabelaPreco(@RequestParam Long pessoa, @RequestParam Long tabelaPreco) {
		service.insertParceiroTabelaPreco(pessoa, tabelaPreco);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma tabela de preço")
	public ResponseEntity<TabelaPreco> update(@Valid @RequestBody TabelaPreco entity, @PathVariable Long id) {
		TabelaPreco savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma tabela de preço")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
