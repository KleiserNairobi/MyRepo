package br.com.chamai.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Municipio;
import br.com.chamai.models.dto.EnderecoDto;
import br.com.chamai.util.maps.GoogleMapsRequests;
import br.com.chamai.util.maps.directions.DirectionsApi;
import br.com.chamai.util.maps.directions.DirectionsApiParams;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixApi;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixParams;
import br.com.chamai.util.maps.geocode.GeocodeApi;
import br.com.chamai.util.maps.geocode.GeocodeApiParams;
import br.com.chamai.util.maps.geocode.Location;
import br.com.chamai.util.maps.geocode.Result;

@Service
public class GoogleMapsService {
	
	@Autowired private GoogleMapsRequests googleMapsRequests;
	@Autowired private MunicipioService municipioService;
	
	public DirectionsApi directionsApi(DirectionsApiParams params) throws Exception {
		return googleMapsRequests.sendRequestDirectionsApi(params);
	}
	
	public DistanceMatrixApi distanceMatrixApi(DistanceMatrixParams params) throws Exception {
		return googleMapsRequests.sendRequestDistanceMatrixApi(params);
	}
	
	public GeocodeApi buscarCep(GeocodeApiParams params) throws Exception {
		return googleMapsRequests.sendRequestGeocodeApi(params);
	}
	
	public Location buscarLatitudeLongitudePorEndereco(String address) throws Exception {
		return latLngFromGeocodeApi(googleMapsRequests.sendRequestGeocodeApiLatitudeLongitude(address));
	}
	
	public DistanceMatrixApi calcularDistancia(String origins, String destinations, String mode) throws Exception {
		return googleMapsRequests.sendRequestDistanceMatrixApi(origins, destinations, mode);
	}
	
	public EnderecoDto buscarEnderecoPorLatitudeLongitude(Location params) throws Exception {
		EnderecoDto enderecoDto = EnderecoDto.enderecoDtoFromGeocodeApi(googleMapsRequests.sendRequestGeocodeApiLatLng(params));
		if (enderecoDto == null) {
			throw new EntidadeNaoEncontrada("CEP não encontrado");
		}
		if (StringUtils.isEmpty(enderecoDto.getCidade())) {
			throw new EntidadeNaoEncontrada("Município não encontrado");
		}
		if (StringUtils.isEmpty(enderecoDto.getEstado())) {
			throw new EntidadeNaoEncontrada("Estado não encontrado");
		}
		
		Municipio municipio = municipioService.findByNomeAndEstado(enderecoDto.getCidade(), enderecoDto.getEstado());
		enderecoDto.setCidadeId(municipio.getId());
		boolean isCobertura = municipio.getCobertura() != null ? municipio.getCobertura() : false;
		enderecoDto.setCobertura(isCobertura);
		return enderecoDto;
	}
	
	
	// ---- métodos auxiliares dos serviços da API do google maps ----
	public Float getDurationValueMinutesFromDirectionsApi(DirectionsApi directionsApi) {
		Integer seconds = getDistanceValueFromDirectionsApi(directionsApi);
		return seconds / 60f;
	}
	
	public Long getDurationValueFromDirectionsApi(DirectionsApi directionsApi) {
		if (!isValidDuration(directionsApi)) {
			return 0l;
		}
		Integer retorno = directionsApi.getRoutes().get(0).getLegs().get(0).getDuration().getValue();
		return retorno.longValue();
	}
	
	public String getDurationTextFromDirectionsApi(DirectionsApi directionsApi) {
		if (!isValidDuration(directionsApi)) {
			return "";
		}
		return directionsApi.getRoutes().get(0).getLegs().get(0).getDuration().getText();
	}
	
	public Float getDistanceValueKmsFromDirectionsApi(DirectionsApi directionsApi) {
		Integer metros = getDistanceValueFromDirectionsApi(directionsApi);
		return metros.floatValue() / 1000f;
	}
	
	public Integer getDistanceValueFromDirectionsApi(DirectionsApi directionsApi) {
		if (!isValidDistance(directionsApi)) {
			return 0;
		}
		return directionsApi.getRoutes().get(0).getLegs().get(0).getDistance().getValue();
	}
	
	public String getDistanceTextFromDirectionsApi(DirectionsApi directionsApi) {
		if (!isValidDistance(directionsApi)) {
			return "";
		}
		return directionsApi.getRoutes().get(0).getLegs().get(0).getDistance().getText();
	}
	
	
	public boolean isValidDuration(DirectionsApi directionsApi) {
		validaDirections(directionsApi);
		if (directionsApi.getRoutes() == null || directionsApi.getRoutes().get(0) == null || directionsApi.getRoutes().get(0).getLegs() == null
				|| directionsApi.getRoutes().get(0).getLegs().get(0) == null || directionsApi.getRoutes().get(0).getLegs().get(0).getDuration() == null) {
			return false;
		}
		return true;
	}
	
	public boolean isValidDistance(DirectionsApi directionsApi) {
		validaDirections(directionsApi);
		if (directionsApi.getRoutes() == null || directionsApi.getRoutes().isEmpty() || directionsApi.getRoutes().get(0).getLegs().isEmpty()
				|| directionsApi.getRoutes().get(0).getLegs().get(0) == null || directionsApi.getRoutes().get(0).getLegs().get(0).getDistance() == null) {
			return false;
		}
		return true;
	}
	
	public void validaDirections(DirectionsApi directionsApi) {
		if (directionsApi == null) {
			throw new ExcecaoTempoExecucao("Resposta nula da API directions.");
		}
		if (!directionsApi.getStatus().equals("OK")) {
			throw new ExcecaoTempoExecucao("Resposta inválida da requisição da API directions. Status do retorno da requisição: " + directionsApi.getStatus());
		}
	}
	
	public static Location latLngFromGeocodeApi(GeocodeApi geocodeApi) {
		if (geocodeApi == null || !"OK".equalsIgnoreCase(geocodeApi.getStatus())) {
			return null;
		}
		
		return locationFromResults(geocodeApi.getResults());
	}
	
	private static Location locationFromResults(List<Result> results) {
		if (results == null || results.size() == 0 || results.get(0) == null ||
				results.get(0).getGeometry() == null || results.get(0).getGeometry().getLocation() == null) {
			return null;
		}
		
		return results.get(0).getGeometry().getLocation();
	}

}
