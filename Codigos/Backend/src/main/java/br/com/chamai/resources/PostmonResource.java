package br.com.chamai.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.chamai.util.postmon.PostmonApi;
import br.com.chamai.util.postmon.PostmonRequests;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/postmon")
@Api(value = "Controlador criado para consumir serviços do Postmon")
@Deprecated
public class PostmonResource {
	
	@Autowired PostmonRequests postmonRequests;
	
	@GetMapping("/buscar-endereco-por-cep")
	@ApiOperation(value = "Busca endereço pelo cep")
	public ResponseEntity<PostmonApi> findEnderecoByCep(@RequestParam String cep) throws Exception {
		PostmonApi postmonApi = postmonRequests.buscarCep(cep);
		return ResponseEntity.ok(postmonApi);
	}

}
