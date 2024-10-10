package br.com.chamai.models.dto;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import br.com.chamai.models.enums.TipoPessoa;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntregadorDto {

    private Long id;
		
    @NotNull(message = "Tipo é obrigatório")
    @Enumerated(EnumType.STRING)
    private TipoPessoa tipo;

    @NotEmpty(message = "Nome é obrigatório")
    @Size(min = 3, max = 60, message = "Nome deve ter entre {min} e {max} caracteres")
    private String nome;

    @NotEmpty(message = "Email é obrigatório")
    @Email(message = "Formato inválido")
    @Size(max = 100, message = "Email deve ter no máximo {max} caracteres")
    private String email;

    @NotEmpty(message = "Telefone é obrigatório")
    @Size(min = 8, max = 14, message = "Telefone deve ter entre {min} e {max} caracteres")
    private String telefone;

    @Size(min = 11, max = 14, message = "CPF/CNPJ deve ter entre {min} e {max} caracteres")
    private String cpfCnpj;

    @NotNull(message = "CEP é obrigatório")
    @Size(min = 8, max = 9, message = "CEP deve ter entre {min} e {max} caracteres")
    private String cep;

    @NotNull(message = "Logradouro é obrigatório")
    @Size(max = 60, message = "Logradouro deve ter no máximo {max} caracteres")
    private String logradouro;

    @NotEmpty(message = "Número é obrigatório")
    @Size(max = 10, message = "Número deve ter entre {min} e {max} caracteres")
    private String numero;

    @NotNull(message = "Complemento é obrigatório")
    @Size(max = 60, message = "Complemento deve ter entre {min} e {max} caracteres")
    private String complemento;

    @NotNull(message = "Bairro é obrigatório")
    @Size(max = 60, message = "Bairro deve ter entre {min} e {max} caracteres")
    private String bairro;

    @Size(max = 60, message = "Referência deve ter no máximo {max} caracteres")
    private String referencia;

    @NotEmpty(message = "Município é obrigatório")
    @Size(max = 60)
    private String municipio;

    @NotEmpty(message = "Estado é obrigatório")
    @Size(min = 2, max = 2)
    private String estado;

    @NotEmpty(message = "Login é obrigatório")
    @Size(max = 100, message = "Login deve ter entre {min} e {max} caracteres")
    private String login;

    @NotEmpty(message = "Senha é obrigatória")
    @Size(min = 4, message = "Senha deve ter no mínimo {min} caracteres")
    private String senha;
    
    private String veiculo;

    private String modelo;

    private String placa;

    private String strVeiculo;

}
