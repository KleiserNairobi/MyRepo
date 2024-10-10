package br.com.chamai.services;

import lombok.Builder;
import lombok.Getter;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.stereotype.Service;
import java.io.InputStream;

@Service
public interface ArmazenaFotoService {

    @Getter
    @Builder
    class NovaFoto {
        private String nomeArquivo;
        private InputStream inputStream;
        private String contentType;
    }

    @Getter
    @Builder
    class FotoDownload {
        private InputStream inputStream;
        private String url;

        public boolean temUrl(){
            return url != null;
        }

        public boolean temInputStream(){
            return inputStream != null;
        }
    }

    void armazenar(NovaFoto novaFoto);

    void remover(String nomeArquivo);

    FotoDownload recuperar(String nomeArquivo);

    default void substituir(String arquivoAntigo, NovaFoto novaFoto) {
        this.armazenar(novaFoto);
        if (arquivoAntigo != null) {
            this.remover(arquivoAntigo);
        }
    }

    default String gerarNomeArquivo(String nomeOriginal, Long id) {
        String codigo = RandomStringUtils.randomAlphanumeric(10);
        return id.toString() + "_" + codigo + "_" + nomeOriginal;
    }

}
