package br.com.chamai.resources;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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

import br.com.chamai.events.EntregaFinalizadaEvent;
import br.com.chamai.events.RecursoCriadoEvent;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.dto.CalculoEntregaDto;
import br.com.chamai.models.dto.EntregaDto;
import br.com.chamai.models.dto.EntregadorDto;
import br.com.chamai.services.EntregaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/entregas")
@Api(value = "Entregas")
public class EntregaResource {

	@Autowired private EntregaService service;
	@Autowired private ApplicationEventPublisher publisher;

	@GetMapping("/{id}")
	@ApiOperation(value = "Retorna uma entrega")
	public ResponseEntity<Entrega> find(@PathVariable Long id) {
		return ResponseEntity.ok().body(service.find(id));
	}
	
	@GetMapping
	@ApiOperation(value = "Retorna uma lista de entregas")
	public ResponseEntity<List<Entrega>> findAll() {
		return ResponseEntity.ok().body(service.findAll());
	}
	
	@PostMapping
	@ApiOperation(value = "Insere uma entrega")
	public ResponseEntity<Entrega> insert(@Valid @RequestBody EntregaDto entity, HttpServletResponse response) {
		Entrega savedEntity = service.insert(entity);
		publisher.publishEvent(new RecursoCriadoEvent(this, response, savedEntity.getId()));
		return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
	}

	@PutMapping("/{id}")
	@ApiOperation(value = "Altera uma entrega")
	public ResponseEntity<Entrega> update(@Valid @RequestBody Entrega entity, @PathVariable Long id) {
		Entrega savedEntity = service.update(entity, id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(savedEntity);
	}
	
	@DeleteMapping("/{id}")
	@ApiOperation(value = "Exclui uma entrega")
	public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/calcular-entrega")
	@ApiOperation(value = "Calcula uma entrega")
	public ResponseEntity<CalculoEntregaDto> calcularEntrega(@Valid @RequestBody CalculoEntregaDto entrega) {
		return ResponseEntity.ok().body(service.calcularValorEntrega(entrega));
	}

	@GetMapping("/{id}/entregador")
	@ApiOperation(value = "Retorna entregador que fará entrega")
	public ResponseEntity<EntregadorDto> getEntregador(@PathVariable Long id) throws MPException {
		return ResponseEntity.ok(service.getEntregador(id));
	}

	@GetMapping("/pessoa/{idPessoa}")
	@ApiOperation(value = "Retorna uma lista de entregas solicitadas por um cliente")
	public ResponseEntity<List<Entrega>> getEntregasByPessoa(@PathVariable Long idPessoa) {
		return ResponseEntity.ok(service.getEntregasByPessoa(idPessoa));
	}

	@GetMapping("/entregador/{idEntregador}")
	@ApiOperation(value = "Retorna uma lista de entregas realizadas por um entregador")
	public ResponseEntity<List<Entrega>> getEntregasByEntregador(@PathVariable Long idEntregador) {
		return ResponseEntity.ok(service.getEntregasByEntregador(idEntregador));
	}

	@PutMapping("/{id}/registrar-hora-saida")
	@ApiOperation(value = "Registra a hora de saída de uma entrega")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void registrarHoraSaida(@PathVariable Long id) {
		service.updateHoraSaida(id);
	}

	@PutMapping("/{id}/registrar-hora-chegada")
	@ApiOperation(value = "Registra a hora de chegada de uma entrega")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void registrarHoraChegada(@PathVariable Long id) {
		service.updateHoraChegada(id);
		publisher.publishEvent(new EntregaFinalizadaEvent(this, id));
	}

}
