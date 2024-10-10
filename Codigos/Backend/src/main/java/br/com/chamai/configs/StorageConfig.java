package br.com.chamai.configs;

import br.com.chamai.configs.security.ChamaiProperty;
import br.com.chamai.models.enums.TipoArmazenamento;
import br.com.chamai.services.ArmazenaFotoLocalService;
import br.com.chamai.services.ArmazenaFotoS3Service;
import br.com.chamai.services.ArmazenaFotoService;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {

    @Autowired
    private ChamaiProperty property;

    @Bean
    public AmazonS3 amazonS3() {
        var credentials = new BasicAWSCredentials(
                property.getAwsId(),
                property.getAwsKey()
        );
        AmazonS3 amazonS3 = AmazonS3ClientBuilder
                .standard()
                .withRegion(Regions.fromName(property.getRegion()))
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
        return amazonS3;
    }

    @Bean
    public ArmazenaFotoService armazenaFotoService() {
        if (TipoArmazenamento.S3.equals(property.getTipoArmazenamento())) {
            return new ArmazenaFotoS3Service();
        } else {
            return new ArmazenaFotoLocalService();
        }
    }

}
