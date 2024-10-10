package br.com.chamai.services;

import br.com.chamai.configs.security.ChamaiProperty;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ArmazenaFotoLocalService implements ArmazenaFotoService {

    @Autowired
    private ChamaiProperty chamaiProperty;

    @Override
    public void armazenar(NovaFoto novaFoto) {
        Path caminho = Path.of(chamaiProperty.getArmazenagemLocalFoto(), novaFoto.getNomeArquivo());
        try {
            FileCopyUtils.copy(novaFoto.getInputStream(), Files.newOutputStream(caminho) );
        } catch (IOException e) {
            throw new ExcecaoTempoExecucao("Não foi possível armazenar arquivo", e);
        }
    }

    @Override
    public void remover(String nomeArquivo) {
        try {
            Path caminho = Path.of(chamaiProperty.getArmazenagemLocalFoto(), nomeArquivo);
            Files.deleteIfExists(caminho);
        } catch (IOException e) {
            throw new ExcecaoTempoExecucao("Não foi possível excluir arquivo", e);
        }
    }

    @Override
    public FotoDownload recuperar(String nomeArquivo) {
        try {
            Path caminho = Path.of(chamaiProperty.getArmazenagemLocalFoto(), nomeArquivo);
            FotoDownload fotoDownload = FotoDownload
                    .builder()
                    .inputStream(Files.newInputStream(caminho))
                    .build();
            return fotoDownload;
        } catch (IOException e) {
            throw new ExcecaoTempoExecucao("Não foi possível recuperar arquivo", e);
        }
    }

}
