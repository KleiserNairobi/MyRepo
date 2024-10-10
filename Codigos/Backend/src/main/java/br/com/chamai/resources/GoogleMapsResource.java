package br.com.chamai.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.chamai.models.dto.EnderecoDto;
import br.com.chamai.services.GoogleMapsService;
import br.com.chamai.util.maps.directions.DirectionsApi;
import br.com.chamai.util.maps.directions.DirectionsApiParams;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixApi;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixParams;
import br.com.chamai.util.maps.geocode.GeocodeApi;
import br.com.chamai.util.maps.geocode.GeocodeApiParams;
import br.com.chamai.util.maps.geocode.Location;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/google-maps")
@Api(value = "Controlador criado para consumir serviços do Google Maps")
public class GoogleMapsResource {
	
	@Autowired private GoogleMapsService service;
	
	@GetMapping("/directions")
	@ApiOperation(value = "Faz requisição ao serviço Directions API do Google Maps")
	public ResponseEntity<DirectionsApi> directionsApi(
																		@RequestParam String origin,
																		@RequestParam String destination,
																		@RequestParam(defaultValue = "driving") String mode,
																		@RequestParam(required = false) String waypoints) throws Exception {
		DirectionsApiParams params = DirectionsApiParams.builder()
				.origin(origin).destination(destination).mode(mode)
			.build();
		return ResponseEntity.ok().body(service.directionsApi(params));
	}
	
	@GetMapping("/distancematrix")
	@ApiOperation(value = "Faz requisição ao serviço Distance Matrix API do Google Maps")
	public ResponseEntity<DistanceMatrixApi> distanceMatrixApi(
																		@RequestParam String origin,
																		@RequestParam String destination,
																		@RequestParam(defaultValue = "driving") String mode) throws Exception {
		DistanceMatrixParams params = DistanceMatrixParams.builder()
				.origin(origin).destination(destination).mode(mode)
			.build();
		return ResponseEntity.ok().body(service.distanceMatrixApi(params));
	}
	
	@GetMapping("/buscar-endereco-por-cep")
	@ApiOperation(value = "Busca endereço pelo cep utilizando serviço Geocode API do Google Maps")
	@Deprecated
	public ResponseEntity<GeocodeApi> buscarCep(@RequestParam String postalCode) throws Exception {
		GeocodeApiParams params = GeocodeApiParams.builder().postalCode(postalCode).build();
		return ResponseEntity.ok().body(service.buscarCep(params));
	}
	
	@GetMapping("/geocoding")
	@ApiOperation(value = "Busca endereço pelo latitude/longitude utilizando serviço Geocode API do Google Maps")
	public ResponseEntity<EnderecoDto> buscarEndereçoPorLatitudeLongitude(@RequestParam Double latitude, @RequestParam Double longitude) throws Exception {
		Location params = Location.builder().lat(latitude).lng(longitude).build();
		return ResponseEntity.ok().body(service.buscarEnderecoPorLatitudeLongitude(params));
	}
	
}
