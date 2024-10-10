package br.com.chamai.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket DSApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("br.com.chamai"))
                .paths(PathSelectors.ant("/**"))
                .build()
//                .ignoredParameterTypes(Usuario.class)
                .apiInfo(metaInfo())
                .globalOperationParameters(Arrays.asList(
                        new ParameterBuilder()
                                .name("Authorization")
                                .description("Header para token JWT")
                                .modelRef(new ModelRef("string"))
                                .parameterType("header")
                                .required(false)
                                .build()
                ));
    }

    private ApiInfo metaInfo() {
        return new ApiInfo(
                "Chamaí - Coletas e Entregas",
                "Este documento descreve a API REST do Aplicativo de Coletas e Entregas da Cidade de Mineiros - GO",
                "1.0",
                "",
                new Contact(
                        "Kleiser Nairobi de Oliveira",
                        "https://www.linkedin.com/in/kleiser-nairobi-de-oliveira-15251520/",
                        "nairobisistemas@gmail.com"
                ),
                "Apache Licence Version 2.0",
                "https://www.apache.org/licenses/LICENSE-2.0",
                Collections.emptyList()
        );
    }

}
