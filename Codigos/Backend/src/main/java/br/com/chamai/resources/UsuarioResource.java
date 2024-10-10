package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;

import br.com.chamai.models.dto.AlterarSenhaDto;
import br.com.chamai.models.dto.TrocarSenhaDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.chamai.models.Permissao;
import br.com.chamai.models.Usuario;
import br.com.chamai.services.UsuarioService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/usuarios")
@Api(value = "Usuários")
public class UsuarioResource {

	@Autowired UsuarioService service;

	@GetMapping
	@ApiOperation(value = "Recupera todos usuários")
	public ResponseEntity<List<Usuario>> findAll() {
		return ResponseEntity.ok(service.findAll());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Recupera um usuário pelo id")
	public ResponseEntity<Usuario> find(@PathVariable Long id) {
		return ResponseEntity.ok(service.find(id));
	}

	@PostMapping
	@ApiOperation(value = "Insere um usuário")
	public ResponseEntity<Usuario> insert(@Valid @RequestBody Usuario entity) {
		Usuario savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
					.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um usuário")
	public ResponseEntity<Usuario> update(@Valid @RequestBody Usuario entity, @PathVariable Long id) {
		Usuario savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um usuário")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/add-permissoes/{id}")
	@ApiOperation(value = "Adiciona uma lista de permissões para um usuário")
	@ResponseStatus(code = HttpStatus.OK)
	public void addPermissions(@RequestBody List<Permissao> entities, @PathVariable Long id) {
		service.insertPermissions(entities, id);
	}

	@PutMapping("/add-permissao/{idUsuario}/{idPermissao}")
	@ApiOperation(value = "Adiciona uma permissão para um usuário")
	@ResponseStatus(code = HttpStatus.OK)
	public void addPermission(@PathVariable Long idUsuario, @PathVariable Long idPermissao) {
		service.insertPermission(idPermissao, idUsuario);
	}
	
	@DeleteMapping("/remove-permissao/{idUsuario}/{idPermissao}")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@ApiOperation(value = "Exclui uma permissão de um usuário")
	public void deletePermission(@PathVariable Long idUsuario, @PathVariable Long idPermissao) throws Exception {
		service.deletePermission(idPermissao, idUsuario);
	}

	@PutMapping("/trocar-senha")
	@ApiOperation(value = "Troca/Altera a senha do usuário - meio externo")
	public ResponseEntity<Usuario> trocarSenha(@Valid @RequestBody TrocarSenhaDto entity) {
		Usuario savedEntity = service.trocarSenha(entity);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}

	@PutMapping("/trocar-senha-usuario-logado")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@ApiOperation(value = "Troca/Altera a senha do usuário logado - meio interno")
	public void updateSenhaUsuarioLogado(@RequestParam String senhaAtual, @RequestParam String senhaNova) {
		service.updateSenhaUsuarioLogado(senhaAtual, senhaNova);
	}

}
