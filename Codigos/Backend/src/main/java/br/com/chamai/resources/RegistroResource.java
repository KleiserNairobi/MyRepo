package br.com.chamai.resources;

import br.com.chamai.models.*;
import br.com.chamai.models.dto.ClienteLSDto;
import br.com.chamai.models.dto.PessoaDto;
import br.com.chamai.services.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/registros")
@Api(value = "Registro")
public class RegistroResource {

    @Autowired private RegistroService service;
    @Autowired private ClientePFService servicePF;
    @Autowired private ClientePJService servicePJ;
    @Autowired private ClienteLSService serviceLS;
    @Autowired private UsuarioService usuarioService;
    @Autowired private FotoService fotoService;

    @GetMapping("/pessoa/email/{email}")
    @ApiOperation(value = "Retorna a pessoa do email informado")
    public ResponseEntity<Pessoa> findPessoaByEmail(@PathVariable String email) {
        return ResponseEntity.ok().body(service.findPessoaByEmail(email));
    }

    @GetMapping("/pessoa/telefone/{telefone}")
    @ApiOperation(value = "Retorna a pessoa do telefone informado")
    public ResponseEntity<Pessoa> findPessoaByTelefone(@PathVariable String telefone) {
        return ResponseEntity.ok().body(service.findPessoaByTelefone(telefone));
    }

    @GetMapping("/usuario/{email}")
    @ApiOperation(value="Recupera um usuário pelo email")
    public ResponseEntity<Optional<Usuario>> findByEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.findByEmailLoginSocial(email);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario);
        }
        return null;
    }

    @PostMapping
    @ApiOperation(value = "Registra pessoa como membro Chamaih")
    public ResponseEntity<Pessoa> insert(@Valid @RequestBody PessoaDto entity) {
        Pessoa savedEntity = service.insert(entity);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

//    @PostMapping("/cliente-pf")
//    @ApiOperation(value = "Registra pessoa física como cliente")
//    public ResponseEntity<Pessoa> insertPF(@Valid @RequestBody ClientePFDto entity) {
//        Pessoa savedEntity = servicePF.insert(entity);
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
//    }

//    @PostMapping("/cliente-pj")
//    @ApiOperation(value = "Registra pessoa jurídica como cliente")
//    public ResponseEntity<Pessoa> insertPJ(@Valid @RequestBody ClientePJDto entity) {
//        Pessoa savedEntity = servicePJ.insert(entity);
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
//    }

    @PostMapping("/cliente-ls")
    @ApiOperation(value = "Registra pessoa login social como cliente")
    public ResponseEntity<Pessoa> insertLS(@Valid @RequestBody ClienteLSDto entity) {
        Pessoa savedEntity = serviceLS.insert(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntity);
    }

//    @PostMapping(value = "/cliente-pf/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @ApiOperation(value = "Insere foto cliente - selfie, documento, etc.")
//    public ResponseEntity<Foto> insertFoto(@Valid @PathVariable Long id, FotoInput fotoInput) throws IOException {
//        Foto savedEntity = fotoService.insert(fotoInput, id);
//        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
//                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
//        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
//    }

    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiOperation(value = "Insere foto - selfie, RG, CE, CNH, CRLV, etc.")
    public ResponseEntity<Foto> inseriFoto(@Valid @PathVariable Long id, FotoInput fotoInput) throws IOException {
        Foto savedEntity = fotoService.insert(fotoInput, id);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
    }

}
