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
import br.com.chamai.models.ParcelaContaPagar;
import br.com.chamai.services.ParcelaContaPagarService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/parcelas-conta-pagar")
@Api(value = "Parcelas conta a pagar")
public class ParcelaContaPagarResource {

	@Autowired
	ParcelaContaPagarService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de parcelas a pagar")
	public ResponseEntity<List<ParcelaContaPagar>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{pagar}")
	@ApiOperation(value = "Retorna as parcelas de uma conta a pagar")
	public ResponseEntity<List<ParcelaContaPagar>> findByPagar(@PathVariable Long pagar) {
		return ResponseEntity.ok().body(service.findByPagar(pagar));
	}

	@GetMapping("/{pagar}/{id}")
	@ApiOperation(value = "Retorna um parcela a pagar")
	public ResponseEntity<ParcelaContaPagar> find(@PathVariable Long pagar, @PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(pagar, id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma parcela a pagar")
	public ResponseEntity<ParcelaContaPagar> insert(@Valid @RequestBody ParcelaContaPagar entity) {
		ParcelaContaPagar savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/efetuar-pagamento")
	@ApiOperation(value = "Insere uma parcela a pagar")
	public ResponseEntity<ParcelaContaPagar> efetuarPagamento(@RequestBody ParcelaContaPagar entity) {
		ParcelaContaPagar savedEntity = service.efetuarPagamento(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{pagar}/{id}")
	@ApiOperation(value = "Altera uma parcela a pagar")
	public ResponseEntity<ParcelaContaPagar> update(
            @Valid @RequestBody ParcelaContaPagar entity, @PathVariable Long pagar, @PathVariable Long id) {
		ParcelaContaPagar savedEntity = service.update(entity, pagar, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{pagar}/{id}")
	@ApiOperation(value = "Exclui uma parcela a pagar")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long pagar, @PathVariable Long id) {
		service.delete(pagar, id);
	}
	
}
