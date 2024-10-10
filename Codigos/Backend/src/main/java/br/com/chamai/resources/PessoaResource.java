package br.com.chamai.resources;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import br.com.chamai.models.Endereco;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.filters.PessoaFilter;
import br.com.chamai.services.EnderecoService;
import br.com.chamai.services.PessoaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/pessoas")
@Api(value = "Pessoas")
public class PessoaResource {

	@Autowired PessoaService service;
	@Autowired EnderecoService enderecoService;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de pessoas")
	public ResponseEntity<List<Pessoa>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/clientes")
	@ApiOperation(value = "Retorna uma lista de clientes")
	public ResponseEntity<List<Pessoa>> findByClientes() {
		return ResponseEntity.ok().body(service.findByClientes());
	}

	@GetMapping("/entregadores")
	@ApiOperation(value = "Retorna uma lista de entregadores")
	public ResponseEntity<List<Pessoa>> findByEntregadores() {
		return ResponseEntity.ok().body(service.findByEntregadores());
	}

	@GetMapping("/colaboradores")
	@ApiOperation(value = "Retorna uma lista de colaboradores")
	public ResponseEntity<List<Pessoa>> findByColaboradores() {
		return ResponseEntity.ok().body(service.findByColaboradores());
	}

	@GetMapping("/parceiros")
	@ApiOperation(value = "Retorna uma lista de parceiros")
	public ResponseEntity<List<Pessoa>> findByparceiros() {
		return ResponseEntity.ok().body(service.findByParceiros());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma pessoa")
	public ResponseEntity<Pessoa> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@GetMapping("/page")
	@ApiOperation(value = "Retorna uma lista paginada de pessoas")
	public Page<Pessoa> findPage(PessoaFilter filter, Pageable pageable) {
		return service.findPage(filter, pageable);
	}

	@PostMapping
	@ApiOperation(value = "Insere uma pessoa")
	public ResponseEntity<Pessoa> insert(@Valid @RequestBody Pessoa entity) {
		Pessoa savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma pessoa")
	public ResponseEntity<Pessoa> update(@Valid @RequestBody Pessoa entity, @PathVariable Long id) {
		Pessoa savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@PutMapping("/{id}/{online}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	@ApiOperation(value = "Altera status online")
	public void updateOnline(@PathVariable Long id, @PathVariable("online") boolean isOnline) {
		service.updateOnline(id, isOnline);
	}

	@PutMapping("/{id}/ativa-inativa")
	@ApiOperation(value = "Ativa ou Inativa uma pessoa")
	public ResponseEntity<Void> ativarInativarPessoa(@PathVariable Long id) {
		service.ativarInativarPessoa(id);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma pessoa")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/enderecos/{idPessoa}")
	@ApiOperation(value = "Retorna os endereços de uma pessoa")
	public ResponseEntity<List<Endereco>> listEnderecos(@PathVariable Long idPessoa) {
		return ResponseEntity.ok().body(enderecoService.listEnderecos(idPessoa));
	}

	@GetMapping("/enderecos/cobertura-municipio/{idPessoa}")
	@ApiOperation(value = "Retorna os endereços de uma pessoa cujo os municípios estão em área de cobertura do aplicativo")
	public ResponseEntity<List<Endereco>> listEnderecosCoberturaMunicipio(@PathVariable Long idPessoa) {
		return ResponseEntity.ok().body(enderecoService.listEnderecosCoberturaMunicipio(idPessoa));
	}

	@PostMapping("/enderecos/{idPessoa}")
	@ResponseStatus(code = HttpStatus.OK)
	@ApiOperation(value = "Insere uma lista de endereço para uma pessoa")
	public void insert(@RequestBody List<Endereco> enderecos, @PathVariable Long idPessoa) {
		enderecoService.insertAddresses(enderecos, idPessoa);
	}
	
	@DeleteMapping("/enderecos/{id}")
	@ApiOperation(value = "Exclui um endereço")
	public ResponseEntity<Void> deleteAdress(@PathVariable Long id) {
		enderecoService.deleteAdress(id);
		return ResponseEntity.noContent().build();
	}
	
	/// TODO implementar
	@GetMapping("/lista-entregadores-por-municipio")
	@ApiOperation(value = "Retorna uma lista de entregadores por município")
	public ResponseEntity<List<Pessoa>> listEntregadoresByMunicipio(@RequestParam String cidade) {
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/{id}/entregador")
	@ApiOperation(value = "Retorna a localização de uma pessoa do tipo entregador")
	public ResponseEntity<Localizacao> findLocalizacaoEntregadorDataAtual(@PathVariable Long id) {
		return ResponseEntity.ok(service.findLocalizacaoEntregadorDataAtual(id));
	}

}
