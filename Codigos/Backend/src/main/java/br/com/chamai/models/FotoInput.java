package br.com.chamai.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class FotoInput {

	@NotNull
	private MultipartFile arquivo;
	@NotEmpty
	private String descricao;
	@NotEmpty
	private String tipoFoto;

	private String contentType;

}
