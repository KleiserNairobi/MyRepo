package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;
import br.com.chamai.models.ContaPagar;
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
import br.com.chamai.services.ContaPagarService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/contas-pagar")
@Api(value = "Conta a Pagar")
public class ContaPagarResource {

	@Autowired
	ContaPagarService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de pagamentos")
	public ResponseEntity<List<ContaPagar>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um pagamento")
	public ResponseEntity<ContaPagar> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma pagamento")
	public ResponseEntity<ContaPagar> insert(@Valid @RequestBody ContaPagar entity) {
		ContaPagar savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um pagamento")
	public ResponseEntity<ContaPagar> update(@Valid @RequestBody ContaPagar entity, @PathVariable Long id) {
		ContaPagar savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um pagamento")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
