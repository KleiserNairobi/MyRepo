package br.com.chamai.resources;

import java.util.List;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.chamai.events.RecursoCriadoEvent;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.services.LocalizacaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/localizacoes")
@Api(value = "Localizações")
public class LocalizacaoResource {
	
	@Autowired LocalizacaoService service;
	@Autowired private ApplicationEventPublisher publisher;
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de localização que tem entregadores na cidade do usuário")
	public ResponseEntity<List<Localizacao>> findAll() {
		return ResponseEntity.ok(service.findAll());
	}
	
	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma localização")
	public ResponseEntity<Localizacao> find(@PathVariable Long id) {
		return ResponseEntity.ok(service.find(id));
	}

	@GetMapping("/{id}/entregador")
	@ApiOperation(value = "Retorna entregador de uma localização")
	public ResponseEntity<Pessoa> findEntregador(@PathVariable Long id) {
		return ResponseEntity.ok(service.findEntregador(id));
	}

	@PostMapping("/entregador")
	@ApiOperation(value = "Insere ou atualiza uma localização para um entregador")
	public ResponseEntity<Localizacao> insertEntregador(@Valid @RequestBody Localizacao entity, HttpServletResponse response) {
		Localizacao savedEntity = service.insertEntregador(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEntity.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
	}

	@PutMapping("/{idPessoa}/{disponivel}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	@ApiOperation(value = "Altera status disponível")
	public void updateDisponivel(@PathVariable Long idPessoa, @PathVariable("disponivel") boolean isDisponivel) {
		service.updateDisponivel(idPessoa, isDisponivel);
	}

}
