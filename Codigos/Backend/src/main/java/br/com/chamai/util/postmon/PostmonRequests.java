package br.com.chamai.util.postmon;

import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.util.validators.ValidationMethods;

@Service
public class PostmonRequests {

	public PostmonApi buscarCep(String cep) throws Exception {
		if (!ValidationMethods.isValidCep(cep)) {
			throw new ExcecaoTempoExecucao("Cep inválido");
		}
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpUriRequest request =
				RequestBuilder.get().setUri(new URI("https://api.postmon.com.br/v1/cep/" + cep)).build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);

			HttpEntity entity = response.getEntity();

			PostmonApi postmonApi = new PostmonApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				postmonApi = gson.fromJson(EntityUtils.toString(entity), PostmonApi.class);
			}

			return postmonApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
}