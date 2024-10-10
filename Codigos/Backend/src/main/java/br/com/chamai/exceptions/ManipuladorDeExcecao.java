package br.com.chamai.exceptions;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.databind.JsonMappingException.Reference;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.PropertyBindingException;

@ControllerAdvice
public class ManipuladorDeExcecao extends ResponseEntityExceptionHandler {

    public static final String MSG_ERRO_GENERICA_USUARIO_FINAL
            = "Ocorreu um erro interno inesperado no sistema."
            + "Tente novamente e se o problema persistir, "
            + "entre em contato com o administrador do sistema.";

    @Autowired
    private MessageSource messageSource;

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(
            HttpMediaTypeNotAcceptableException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return ResponseEntity.status(status).headers(headers).build();
    }

    @Override
    protected ResponseEntity<Object> handleBindException(
            BindException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return trataValidacaoInterna(ex, headers, status, request, ex.getBindingResult());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return trataValidacaoInterna(ex, headers, status, request, ex.getBindingResult());
    }

    private ResponseEntity<Object> trataValidacaoInterna(
            Exception ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request,
            BindingResult bindingResult) {

        String detalhe = "Um ou mais campos estão inválidos. Faça o preenchimento correto e tente novamente.";

        List<Problema.Object> problemas = bindingResult
                .getAllErrors()
                .stream()
                .map(objectError -> {
                    String mensagem = messageSource.getMessage(objectError, LocaleContextHolder.getLocale());
                    String nome = objectError.getObjectName();

                    if (objectError instanceof FieldError) {
                        nome = ((FieldError) objectError).getField();
                    }

                    return Problema.Object.builder()
                            .campo(nome)
                            .problema(mensagem)
                            .build();
                })
                .collect(Collectors.toList());

        Problema problema = createProblemBuilder(
                status,
                TipoProblema.DADOS_INVALIDOS,
                detalhe
        ).listaDeProblemas(problemas).build();

        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> trataNaoCapturados(Exception ex, WebRequest request) {
        Problema problema = createProblemBuilder(
                HttpStatus.INTERNAL_SERVER_ERROR,
                TipoProblema.ERRO_DE_SISTEMA,
                MSG_ERRO_GENERICA_USUARIO_FINAL
        ).build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        String detalhe = String.format("O recurso %s, que você tentou acessar, é inexistente.", ex.getRequestURL());
        Problema problema = createProblemBuilder(status, TipoProblema.RECURSO_NAO_ENCONTRADO, detalhe).build();
        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleTypeMismatch(
            TypeMismatchException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        if (ex instanceof MethodArgumentTypeMismatchException) {
            return trataIncompatibilidadeDeTipo(
                    (MethodArgumentTypeMismatchException) ex, headers, status, request
            );
        }
        return super.handleTypeMismatch(ex, headers, status, request);
    }

    private ResponseEntity<Object> trataIncompatibilidadeDeTipo(
            MethodArgumentTypeMismatchException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        String detalhe = String.format("O parâmetro de URL '%s' recebeu o valor '%s', "
                        + "que é de um tipo inválido. Corrija e informe um valor compatível com o tipo %s.",
                ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());

        Problema problema = createProblemBuilder(status, TipoProblema.PARAMETRO_INVALIDO, detalhe).build();
        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        Throwable causaProblema = ExceptionUtils.getRootCause(ex);

        if (causaProblema instanceof InvalidFormatException) {
            return trataFormatoInvalido((InvalidFormatException) causaProblema, headers, status, request);
        } else if (causaProblema instanceof PropertyBindingException) {
            return trataPropriedade((PropertyBindingException) causaProblema, headers, status, request);
        }

        String detalhe = "O corpo da requisição está inválido. Verifique erro de sintaxe.";

        Problema problema = createProblemBuilder(status, TipoProblema.MENSAGEM_INCOMPREENSIVEL, detalhe)
                .erro(MSG_ERRO_GENERICA_USUARIO_FINAL)
                .build();

        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    private ResponseEntity<Object> trataPropriedade(
            PropertyBindingException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        String caminho = joinPath(ex.getPath());
        String detalhe = String.format("A propriedade '%s' não existe. "
                + "Corrija ou remova essa propriedade e tente novamente.", caminho);

        Problema problema = createProblemBuilder(status, TipoProblema.MENSAGEM_INCOMPREENSIVEL, detalhe).build();
        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    private ResponseEntity<Object> trataFormatoInvalido(
            InvalidFormatException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        String caminho = joinPath(ex.getPath());
        String detalhe = String.format("A propriedade '%s' recebeu o valor '%s', "
                        + "que é de um tipo inválido. Corrija e informe um valor compatível com o tipo %s.",
               caminho, ex.getValue(), ex.getTargetType().getSimpleName());

        Problema problema = createProblemBuilder(status, TipoProblema.MENSAGEM_INCOMPREENSIVEL, detalhe).build();
        return handleExceptionInternal(ex, problema, headers, status, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> trataIntegridadeDeDados(DataIntegrityViolationException ex, WebRequest request) {
        String detalhe = "Não foi possível realizar a operação. ";

        if (request.getParameter("acao").equals("excluir")) {
            detalhe += "O registro que deseja excluir possui vínculo(s).";
        } else {
            detalhe += "Já existe no sistema um registro com o dódigo informado. " +
            "Verifique a unicidade dos dados em chaves primárias e índices únicos.";
        }

        Problema problema = createProblemBuilder(
                HttpStatus.BAD_REQUEST,
                TipoProblema.INTEGRIDADE_DE_DADOS,
                detalhe
        ).build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> trataAcessoNegado(AccessDeniedException ex, WebRequest request) {
        Problema problema = createProblemBuilder(
                HttpStatus.FORBIDDEN,
                TipoProblema.ACESSO_NEGADO,
                ex.getMessage()
        ).detalhe(ex.getMessage())
                .erro("Você não possui permissão para executar essa operação.")
                .build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(EntidadeNaoEncontrada.class)
    public ResponseEntity<?> trataEntidadeNaoEncontrada(EntidadeNaoEncontrada ex, WebRequest request) {
        Problema problema = createProblemBuilder(
                HttpStatus.NOT_FOUND,
                TipoProblema.RECURSO_NAO_ENCONTRADO,
                ex.getMessage()
        ).build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(EntidadeEmUso.class)
    public ResponseEntity<?> trataEntidadeEmUso(EntidadeEmUso ex, WebRequest request) {
        Problema problema = createProblemBuilder(
                HttpStatus.CONFLICT,
                TipoProblema.ENTIDADE_EM_USO,
                ex.getMessage()
        ).build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(ExcecaoTempoExecucao.class)
    public ResponseEntity<?> trataNegocio(ExcecaoTempoExecucao ex, WebRequest request) {
        Problema problema = createProblemBuilder(
                HttpStatus.BAD_REQUEST,
                TipoProblema.ERRO_NEGOCIO,
                ex.getMessage()
        ).build();
        return handleExceptionInternal(ex, problema, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex,
            Object body,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        if (body == null) {
            body = Problema.builder()
                    .dataHora(OffsetDateTime.now())
                    .erro(status.getReasonPhrase())
                    .status(status.value())
                    .build();
        } else if (body instanceof String) {
            body = Problema.builder()
                    .dataHora(OffsetDateTime.now())
                    .erro((String) body)
                    .status(status.value())
                    .build();
        }
        return super.handleExceptionInternal(ex, body, headers, status, request);
    }

    private Problema.ProblemaBuilder createProblemBuilder(
            HttpStatus status,
            TipoProblema tipoProblema,
            String detail) {
        return Problema.builder()
                .dataHora(OffsetDateTime.now())
                .status(status.value())
                //.caminho(tipoProblema.getUri())
                .erro(tipoProblema.getTitulo())
                .detalhe(detail);
    }

    private String joinPath(List<Reference> references) {
        return references.stream()
                .map(ref -> ref.getFieldName())
                .collect(Collectors.joining("."));
    }

}
