package br.com.chamai.models.dto;

import br.com.chamai.models.enums.StatusAprovacao;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AprovacaoDto {
    private StatusAprovacao statusAprovacao;
}
