package br.com.chamai.services;

import br.com.chamai.configs.security.ChamaiProperty;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import java.net.URL;

public class ArmazenaFotoS3Service implements ArmazenaFotoService {

    @Autowired private AmazonS3 amazonS3;
    @Autowired private ChamaiProperty property;

    @Override
    public void armazenar(NovaFoto novaFoto) {
        try {
            var objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(novaFoto.getContentType());
            var putObjectRequest = new PutObjectRequest(
                    property.getBucket(),
                    novaFoto.getNomeArquivo(),
                    novaFoto.getInputStream(),
                    objectMetadata
            ).withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putObjectRequest);
        } catch (Exception e) {
            throw new ExcecaoTempoExecucao("Não foi possível enviar arquivo para AWS-S3", e);
        }
    }

    @Override
    public void remover(String nomeArquivo) {
        try {
            var deleteObjectRequest = new DeleteObjectRequest(property.getBucket(), nomeArquivo);
            amazonS3.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new ExcecaoTempoExecucao("Não foi possível excluir arquivo na AWS-S3", e);
        }
    }

    @Override
    public FotoDownload recuperar(String nomeArquivo) {
        URL url = amazonS3.getUrl(property.getBucket(), nomeArquivo);
        return FotoDownload.builder().url(url.toString()).build();
    }
}
