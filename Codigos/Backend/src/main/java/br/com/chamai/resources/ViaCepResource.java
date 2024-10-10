package br.com.chamai.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.chamai.util.viacep.ViaCepApi;
import br.com.chamai.util.viacep.ViaCepRequests;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/viacep")
@Api(value = "Controlador criado para consumir serviços do ViaCEP")
@Deprecated
public class ViaCepResource {
	
	@Autowired ViaCepRequests viaCepRequests;
	
	@GetMapping("/buscar-endereco-por-cep")
	@ApiOperation(value = "Busca endereço pelo cep")
	public ResponseEntity<ViaCepApi> buscarCep(@RequestParam String cep) throws Exception {
		return ResponseEntity.ok().body(viaCepRequests.buscarCep(cep));
	}

}
