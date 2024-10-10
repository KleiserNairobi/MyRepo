package br.com.chamai;

import java.io.IOException;
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@SpringBootApplication
public class AppChamai {

	public static void main(String[] args) throws IOException {
		SpringApplication.run(AppChamai.class, args);
	}
	
	@PostConstruct
	void started() {
		// Em caso de horário de verão deve-se comentar a linha abaixo
		TimeZone.setDefault(TimeZone.getTimeZone("GMT-3"));
	}

}
