package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;

import br.com.chamai.models.Pessoa;
import br.com.chamai.services.PessoaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.chamai.models.Veiculo;
import br.com.chamai.services.VeiculoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/veiculos")
@Api(value = "Veículos")
public class VeiculoResource {

	@Autowired VeiculoService service;
	@Autowired PessoaService pessoaService;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de veículos")
	public ResponseEntity<List<Veiculo>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um veículo")
	public ResponseEntity<Veiculo> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma veículo")
	public ResponseEntity<Veiculo> insert(@Valid @RequestBody Veiculo entity) {
		Veiculo savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um veículo")
	public ResponseEntity<Veiculo> update(@Valid @RequestBody Veiculo entity, @PathVariable Long id) {
		Veiculo savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um veículo")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("pessoa/{idPessoa}")
	@ApiOperation(value = "Retorna uma lista de veículos associados a uma pessoa ")
	public ResponseEntity<List<Veiculo>> findVeiculosByPessoa(@PathVariable Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		return ResponseEntity.ok().body(service.findByPessoa( pessoa ));
	}

	@GetMapping("pessoa/{idPessoa}/ativo")
	@ApiOperation(value = "Retorna o veículo ativo de uma pessoa ")
	public ResponseEntity<Optional<Veiculo>> findByPessoaAndAtivo(@PathVariable Long idPessoa) {
		Optional<Veiculo> veiculo = service.findByPessoaAndAtivo( idPessoa );
		return ResponseEntity.ok().body(veiculo);
	}

	@PutMapping("/{id}/{ativo}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	@ApiOperation(value = "Altera status ativo")
	public void updateAtivo(@PathVariable Long id, @PathVariable("ativo") boolean isAtivo) {
		service.updateAtivo(id, isAtivo);
	}

}
