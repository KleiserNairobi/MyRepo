package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import br.com.chamai.models.Agencia;
import br.com.chamai.repositories.filters.AgenciaFilter;
import br.com.chamai.services.AgenciaService;

@RestController
@RequestMapping("/agencias")
@Api(value = "Agências Bancárias Brasileiras")
public class AgenciaResource {

	@Autowired AgenciaService service;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de agências")
	//@PreAuthorize("hasAuthority('ROLE_PESQUISAR_AGENCIA') and #oauth2.hasScope('read')")
	public ResponseEntity<List<Agencia>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@GetMapping("/page")
	@ApiOperation(value = "Retorna uma lista paginada de agências")
	//@PreAuthorize("hasAuthority('ROLE_PESQUISAR_AGENCIA') and #oauth2.hasScope('read')")
	public Page<Agencia> findPage(AgenciaFilter filter, Pageable pageable) {
		return service.findPage(filter, pageable);
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma agência")
	//@PreAuthorize("hasAuthority('ROLE_PESQUISAR_AGENCIA') and #oauth2.hasScope('read')")
	public ResponseEntity<Agencia> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@GetMapping("/banco/{banco}")
	@ApiOperation(value = "Retorna uma lista de agências de um banco")
	//@PreAuthorize("hasAuthority('ROLE_PESQUISAR_AGENCIA') and #oauth2.hasScope('read')")
	public ResponseEntity<List<Agencia>> listByBanco(@PathVariable Long banco) {
		List<Agencia> agencias = service.listByBanco(banco);
		return ResponseEntity.ok(agencias);
	}

	@GetMapping("/codigo-agencia/{codigo}")
	@ApiOperation(value = "Retorna os dados de uma agência com base no seu código")
	public ResponseEntity<Agencia> findByCodigoAgencia(@PathVariable String codigo) {
		Agencia agencia = service.findByCodigoAgencia(codigo);
		return ResponseEntity.ok(agencia);
	}

	@PostMapping
	@ApiOperation(value = "Insere uma agência")
	//@PreAuthorize("hasAuthority('ROLE_CADASTRAR_AGENCIA') and #oauth2.hasScope('write')")
	public ResponseEntity<Agencia> insert(@Valid @RequestBody Agencia entity) {
		Agencia savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma agência")
	//@PreAuthorize("hasAuthority('ROLE_CADASTRAR_AGENCIA') and #oauth2.hasScope('write')")
	public ResponseEntity<Agencia> update(@Valid @RequestBody Agencia entity, @PathVariable Long id) {
		Agencia savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma agência")
	//@PreAuthorize("hasAuthority('ROLE_REMOVER_AGENCIA') and #oauth2.hasScope('write')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
