package br.com.chamai.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.List;

@JsonInclude(Include.NON_NULL)
@Builder
@Getter
public class Problema {

    private Integer status;
    private OffsetDateTime dataHora;
    private String erro;
    private String detalhe;
    private List<Object> listaDeProblemas;

    @Builder
    @Getter
    public static class Object {
        private String campo;
        private String problema;
    }

}
