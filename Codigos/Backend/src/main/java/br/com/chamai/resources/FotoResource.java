package br.com.chamai.resources;

import br.com.chamai.models.Foto;
import br.com.chamai.repositories.FotoRepository;
import br.com.chamai.services.ArmazenaFotoService;
import br.com.chamai.services.FotoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fotos")
@Api(value = "Fotos")
public class FotoResource {

    @Autowired private FotoService service;
    @Autowired private FotoRepository repository;
    @Autowired private ArmazenaFotoService afService;

    @GetMapping
    @ApiOperation(value = "Retorna uma lista de fotos")
    public ResponseEntity<List<Foto>> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Retorna uma foto")
    public ResponseEntity<Foto> find(@PathVariable Long id) {
        return ResponseEntity.ok().body(service.find(id));
    }

    @GetMapping(value = "/pessoa/{idPessoa}")
    @ApiOperation(value = "Retorna as fotos de uma pessoa")
    public ResponseEntity<List<Foto>> findByPessoa(@PathVariable Long idPessoa) {
        return ResponseEntity.ok().body(service.findByPessoa(idPessoa));
    }

    @GetMapping(value = "/pessoa/{idPessoa}/tipo")
    @ApiOperation(value = "Retorna a foto de uma pessoa correspondente ao tipo especificado ")
    public ResponseEntity<Optional<Foto>> findByPessoaAndTipoFoto(
            @PathVariable Long idPessoa,
            @RequestParam(name = "tipoFoto", required = true) String tipoFoto
    ) {
        return ResponseEntity.ok().body(service.findByPessoaAndTipoFoto(idPessoa, tipoFoto));
    }

    @GetMapping(value = "/{id}")
    @ApiOperation(value = "Retorna uma foto")
    public ResponseEntity<?> findFoto(
            @PathVariable Long id,
            @RequestHeader(name = "accept") String acceptHeader) throws HttpMediaTypeNotAcceptableException {
        Optional<Foto> foto = repository.findById(id);
        if (foto.isPresent()) {
            String tipoMediaType = service.pegaTipoMediaType(foto.get().getTipoConteudo().toString().toUpperCase());
            MediaType mediaTypeFoto = MediaType.parseMediaType(tipoMediaType);
            List<MediaType> mediaTypesAceitas = MediaType.parseMediaTypes(acceptHeader);
            verificarCompatibilidade(mediaTypeFoto, mediaTypesAceitas);

            ArmazenaFotoService.FotoDownload fotoDownload = afService.recuperar(foto.get().getNomeArquivo()) ;

            if (fotoDownload.temUrl()) {
                return ResponseEntity
                        .status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, fotoDownload.getUrl())
                        .build();
            } else {
                return ResponseEntity.ok()
                        .contentType(mediaTypeFoto)
                        .body(new InputStreamResource(fotoDownload.getInputStream()));
            }
        }
        return null;
    }

    private void verificarCompatibilidade(
            MediaType mediaTypeFoto,
            List<MediaType> mediaTypesAceitas)
            throws HttpMediaTypeNotAcceptableException {
        boolean compativel = mediaTypesAceitas
                .stream()
                .anyMatch(mediaTypeAceita -> mediaTypeAceita.isCompatibleWith(mediaTypeFoto));
        if (!compativel) {
            throw new HttpMediaTypeNotAcceptableException(mediaTypesAceitas);
        }
    }


//    @PostMapping
//    @ApiOperation(value = "Insere uma foto")
//    public ResponseEntity<Foto> insert(@Valid @RequestBody Foto entity) {
//        Foto savedEntity = service.insert(entity);
//        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
//                .path("/{id}").buildAndExpand(savedEntity.getId()).toUri();
//        return ResponseEntity.status(HttpStatus.CREATED).location(uri).body(savedEntity);
//    }

//    @PutMapping("/{id}")
//    @ApiOperation(value = "Altera uma foto")
//    public ResponseEntity<Foto> update(@Valid @RequestBody Foto entity, @PathVariable Long id) {
//        service.update(entity, id);
//        return ResponseEntity.noContent().build();
//    }

//    @DeleteMapping("/{id}")
//    @ApiOperation(value = "Exclui uma foto")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        service.delete(id);
//        return ResponseEntity.noContent().build();
//    }


}
