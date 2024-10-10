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
import br.com.chamai.models.Desconto;
import br.com.chamai.services.DescontoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/descontos")
@Api(value = "Descontos")
public class DescontoResource {

	@Autowired DescontoService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de descontos")
	public ResponseEntity<List<Desconto>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um desconto, pesquisa por ID")
	public ResponseEntity<Desconto> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@GetMapping("/validar/{idPessoa}/{codCupom}")
	@ApiOperation(value = "Valida utilização de cupom de desconto por pessoa")
	public ResponseEntity<Optional<Desconto>> findByCodigo(@PathVariable Long idPessoa, @PathVariable String codCupom) {
		return ResponseEntity.ok().body(service.findByCodigo(idPessoa, codCupom));
	}

	@PostMapping
	@ApiOperation(value = "Insere um desconto")
	public ResponseEntity<Desconto> insert(@Valid @RequestBody Desconto entity) {
		Desconto savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);

	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um desconto")
	public ResponseEntity<Desconto> update(@Valid @RequestBody Desconto entity, @PathVariable Long id) {
		Desconto savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um desconto")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
