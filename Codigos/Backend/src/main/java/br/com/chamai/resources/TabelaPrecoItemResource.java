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

import br.com.chamai.models.TabelaPrecoItem;
import br.com.chamai.services.TabelaPrecoItemService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/tabela-preco-itens")
@Api(value = "Tabela de itens de preços")
public class TabelaPrecoItemResource {

	@Autowired TabelaPrecoItemService service;
	

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma tabela de itens de preço")
	public ResponseEntity<TabelaPrecoItem> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de tabela de itens de preços")
	public ResponseEntity<List<TabelaPrecoItem>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma tabela de itens de preço")
	public ResponseEntity<TabelaPrecoItem> insert(@Valid @RequestBody TabelaPrecoItem entity) {
		TabelaPrecoItem savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma tabela de itens de preço")
	public ResponseEntity<TabelaPrecoItem> update(@Valid @RequestBody TabelaPrecoItem entity, @PathVariable Long id) {
		TabelaPrecoItem savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma tabela de itens de preço")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
