package br.com.chamai.resources;

import java.net.URI;
import java.util.List;
import javax.validation.Valid;

import br.com.chamai.models.dto.AgendamentoDto;
import br.com.chamai.models.dto.RespostaCancelaAgendamentoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.chamai.models.Agendamento;
import br.com.chamai.services.AgendamentoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/agendamentos")
@Api(value = "Agendamentos")
public class AgendamentoResource {

	@Autowired AgendamentoService service;

	@GetMapping
	@ApiOperation(value = "Retorna uma lista de agendamentos")
	public ResponseEntity<List<Agendamento>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna um agendamento")
	public ResponseEntity<Agendamento> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}

	@PostMapping
	@ApiOperation(value = "Insere um agendamento")
	public ResponseEntity<Agendamento> insert(@Valid @RequestBody AgendamentoDto entity) {
		Agendamento savedEntity = service.insert(entity);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
		return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
	}
	
	@PutMapping("/{id}")
	@ApiOperation(value = "Altera um agendamento")
	public ResponseEntity<Agendamento> update(@Valid @RequestBody Agendamento entity, @PathVariable Long id) {
		Agendamento savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}

	@PutMapping("/{id}/cancela")
	@ApiOperation(value = "Cancela um ou mais agendamento(s)")
	public ResponseEntity<RespostaCancelaAgendamentoDto> cancela(
			@PathVariable Long id,
			@RequestParam(name = "tipo", required = true) String tipo
	) {
		RespostaCancelaAgendamentoDto resposta = service.cancela(id, tipo);
		return ResponseEntity.ok().body(resposta);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui um agendamento")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
}
