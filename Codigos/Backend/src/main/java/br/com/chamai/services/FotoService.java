package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.Foto;
import br.com.chamai.models.FotoInput;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.enums.TipoConteudo;
import br.com.chamai.models.enums.TipoFoto;
import br.com.chamai.repositories.FotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class FotoService {

    @Autowired
    private FotoRepository repository;
    @Autowired
    private PessoaService pessoaService;
    @Autowired
    private ArmazenaFotoService afService;

    public List<Foto> findAll() {
        return repository.findAll();
    }

    public Foto find(Long id) {
        String mensagem = "Não existe um cadastro de foto com o id ";
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada(mensagem + id )
        );
    }

    public List<Foto> findByPessoa(Long idPessoa) {
        Pessoa pessoa = pessoaService.find(idPessoa);
        return repository.findByPessoa(pessoa);
    }

    public Optional<Foto> findByPessoaAndTipoFoto(Long idPessoa, String tipoFoto) {
        return repository.findByPessoaAndTipoFoto(idPessoa, tipoFoto);
    }

    @Transactional
    public Foto insert(FotoInput fotoInput, Long id) throws IOException {
        MultipartFile arquivo = fotoInput.getArquivo();
        String contentType = arquivo.getContentType();
        String nomeArquivo = afService.gerarNomeArquivo(arquivo.getOriginalFilename(), id);
        String nomeArquivoExistente = null;
        String tipoFoto = fotoInput.getTipoFoto();
        Foto foto = new Foto();

        Optional<Foto> fotoExistente = findByPessoaAndTipoFoto(id, tipoFoto);
        if (fotoExistente.isPresent()) {
            nomeArquivoExistente = fotoExistente.get().getNomeArquivo();
            foto.setId(fotoExistente.get().getId());
            foto.setPessoa(fotoExistente.get().getPessoa());
            foto.setDescricao(fotoInput.getDescricao().toUpperCase());
            foto.setNomeArquivo(nomeArquivo.toLowerCase());
            foto.setTamanho(arquivo.getSize());
            foto.setTipoConteudo(pegaTipoConteudo(contentType));
            foto.setTipoFoto(pegaTipoFoto(tipoFoto));
        } else {
            Pessoa pessoa = pessoaService.find(id);
            foto.setPessoa(pessoa);
            foto.setDescricao(fotoInput.getDescricao().toUpperCase());
            foto.setNomeArquivo(nomeArquivo.toLowerCase());
            foto.setTamanho(arquivo.getSize());
            foto.setTipoConteudo(pegaTipoConteudo(contentType));
            foto.setTipoFoto(pegaTipoFoto(tipoFoto));
        }

        foto = repository.save(foto);
        repository.flush();

        ArmazenaFotoService.NovaFoto novaFoto = ArmazenaFotoService.NovaFoto.builder()
                .nomeArquivo(foto.getNomeArquivo())
                .inputStream(arquivo.getInputStream())
                .contentType(contentType)
                .build();
        afService.substituir(nomeArquivoExistente, novaFoto);
        ArmazenaFotoService.FotoDownload fotoDownload = afService.recuperar(novaFoto.getNomeArquivo());

        foto.setLink(fotoDownload.getUrl());
        foto = repository.save(foto);

        return foto;
    }

    private TipoConteudo pegaTipoConteudo(String contentType) {
        if (contentType.equals("image/jpg")) {return TipoConteudo.JPG;}
        if (contentType.equals("image/jpeg")) {return TipoConteudo.JPEG;}
        if (contentType.equals("image/png")) {return TipoConteudo.PNG;}
        return null;
    }

    public String pegaTipoMediaType(String tipoConteudo) {
        if (tipoConteudo.equals("JPG")) {return "image/jpg";}
        if (tipoConteudo.equals("JPEG")) {return "image/jpeg";}
        if (tipoConteudo.equals("PNG")) {return "image/png";}
        return null;
    }

    private TipoFoto pegaTipoFoto(String tipoFoto) {
        if (tipoFoto.equals("P")) {return TipoFoto.P;}
        if (tipoFoto.equals("RG")) {return TipoFoto.RG;}
        if (tipoFoto.equals("CE")) {return TipoFoto.CE;}
        if (tipoFoto.equals("CNH")) {return TipoFoto.CNH;}
        if (tipoFoto.equals("CRLV")) {return TipoFoto.CRLV;}
        return null;
    }



}
