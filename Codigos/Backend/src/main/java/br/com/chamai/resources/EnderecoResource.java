package br.com.chamai.resources;

import br.com.chamai.models.dto.EnderecoCadDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.chamai.models.Endereco;
import br.com.chamai.models.dto.EnderecoDto;
import br.com.chamai.services.EnderecoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/enderecos")
@Api(value = "Endereços")
public class EnderecoResource {

	@Autowired EnderecoService service;
	
	@GetMapping("/buscar-endereco-por-cep")
	@ApiOperation(value = "Busca endereço pelo cep")
	public ResponseEntity<EnderecoDto> buscarEnderecoPorCep(@RequestParam String cep) throws Exception {
		return ResponseEntity.ok().body(service.buscarEnderecoPorCep(cep));
	}

	@GetMapping
	@ApiOperation(value = "Retorna uma lista de enderecos")
	public ResponseEntity<List<Endereco>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um endereco")
	public ResponseEntity<Endereco> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@GetMapping("/proprio/{idPessoa}")
	@ApiOperation(value = "Retorna o endereço próprio de uma pessoa")
	public ResponseEntity<Endereco> findProprioByPessoa(@PathVariable Long idPessoa) {
		return ResponseEntity.ok().body(service.findProprioByPessoa(idPessoa));
	}

	@PostMapping
	@ApiOperation(value = "Insere um endereço")
	public ResponseEntity<Endereco> insert(@Valid @RequestBody EnderecoCadDto entity) {
		Endereco savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}

	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um endereço")
	public ResponseEntity<Endereco> update(@Valid @RequestBody EnderecoCadDto entity, @PathVariable Long id) {
		service.update(entity, id);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um endereço")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}


}
