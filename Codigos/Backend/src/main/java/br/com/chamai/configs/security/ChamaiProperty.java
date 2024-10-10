package br.com.chamai.configs.security;

import br.com.chamai.models.enums.TipoArmazenamento;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties("chamai")
public class ChamaiProperty {

	@Getter @Setter
	private String googleMapsApiKey = "AIzaSyAK3314wVqSt0tga9k1DCvIOfTcDznHeVE";

	@Getter
	private String armazenagemLocalFoto = "/Users/Kleiser Nairobi/Desktop/Fotos";

	@Getter
	private String awsId = "AKIAXDE75HPWLTWSTM55";

	@Getter
	private String awsKey = "U1FP1qLLO6pxz04w4bdGK9HcYCk5qH+dn8FGpTuF";

	@Getter
	private String region = "us-east-1";

	@Getter
	private String bucket = "chamai-fotos";

	@Getter
	private TipoArmazenamento tipoArmazenamento = TipoArmazenamento.S3;

	@Getter
	private final Seguranca seguranca = new Seguranca();

	@Getter @Setter
	public static class Seguranca {
		private boolean enableHttps;
	}
}