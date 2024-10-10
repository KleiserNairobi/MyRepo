package br.com.chamai.util.maps;

import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import br.com.chamai.configs.security.ChamaiProperty;
import br.com.chamai.util.maps.directions.DirectionsApi;
import br.com.chamai.util.maps.directions.DirectionsApiParams;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixApi;
import br.com.chamai.util.maps.distancematrix.DistanceMatrixParams;
import br.com.chamai.util.maps.geocode.GeocodeApi;
import br.com.chamai.util.maps.geocode.GeocodeApiParams;
import br.com.chamai.util.maps.geocode.Location;

@Service
public class GoogleMapsRequests {

	@Autowired private ChamaiProperty chamaiProperty;

	public DirectionsApi sendRequestDirectionsApi(DirectionsApiParams params) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();

		HttpUriRequest request = RequestBuilder.get()
				.setUri(new URI("https://maps.googleapis.com/maps/api/directions/json"))
				.addParameter("origin", params.getOrigin())
				.addParameter("destination", params.getDestination())
				.addParameter("mode", params.getMode())
				.addParameter("waypoints", params.getWaypoints())
				.addParameter("language", "pt-BR")
				.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
			.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);

			HttpEntity entity = response.getEntity();

			DirectionsApi utilDirectionsResponse = new DirectionsApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				utilDirectionsResponse = gson.fromJson(EntityUtils.toString(entity), DirectionsApi.class);
			}

			return utilDirectionsResponse;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
	public DistanceMatrixApi sendRequestDistanceMatrixApi(DistanceMatrixParams params) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		HttpUriRequest request = RequestBuilder.get()
				.setUri(new URI("https://maps.googleapis.com/maps/api/distancematrix/json"))
				.addParameter("origins", params.getOrigin())
				.addParameter("destinations", params.getDestination())
				.addParameter("mode", params.getMode())
				.addParameter("language", "pt-BR")
				.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
			.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);
			
			HttpEntity entity = response.getEntity();
			
			DistanceMatrixApi distanceMatrixApi = new DistanceMatrixApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				distanceMatrixApi = gson.fromJson(EntityUtils.toString(entity), DistanceMatrixApi.class);
			}
			
			return distanceMatrixApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	public DistanceMatrixApi sendRequestDistanceMatrixApi(String origins, String destinations, String mode) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		HttpUriRequest request = RequestBuilder.get()
				.setUri(new URI("https://maps.googleapis.com/maps/api/distancematrix/json"))
				.addParameter("origins", origins)
				.addParameter("destinations", destinations)
				.addParameter("mode", mode)
				.addParameter("language", "pt-BR")
				.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
				.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);
			
			HttpEntity entity = response.getEntity();
			
			DistanceMatrixApi distanceMatrixApi = new DistanceMatrixApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				distanceMatrixApi = gson.fromJson(EntityUtils.toString(entity), DistanceMatrixApi.class);
			}
			
			return distanceMatrixApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
	public GeocodeApi sendRequestGeocodeApi(GeocodeApiParams params) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		HttpUriRequest request = RequestBuilder.get()
				.setUri(new URI("https://maps.googleapis.com/maps/api/geocode/json"))
				.addParameter("address", params.getAddress())
				.addParameter("components", "postal_code:" + params.getPostalCode())
				.addParameter("language", "pt-BR")
				.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
			.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);
			
			HttpEntity entity = response.getEntity();
			
			GeocodeApi geocodeApi = new GeocodeApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				geocodeApi = gson.fromJson(EntityUtils.toString(entity), GeocodeApi.class);
			}
			
			return geocodeApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
	public GeocodeApi sendRequestGeocodeApiLatitudeLongitude(String address) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		HttpUriRequest request = RequestBuilder.get()
					.setUri(new URI("https://maps.googleapis.com/maps/api/geocode/json"))
					.addParameter("address", address)
					.addParameter("language", "pt-BR")
					.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
				.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);
			
			HttpEntity entity = response.getEntity();
			
			GeocodeApi geocodeApi = new GeocodeApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				geocodeApi = gson.fromJson(EntityUtils.toString(entity), GeocodeApi.class);
			}
			
			return geocodeApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
	public GeocodeApi sendRequestGeocodeApiLatLng(Location params) throws Exception {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		
		HttpUriRequest request = RequestBuilder.get()
					.setUri(new URI("https://maps.googleapis.com/maps/api/geocode/json"))
					.addParameter("latlng", params.getLat().toString() + "," + params.getLng().toString())
					.addParameter("location_type", "ROOFTOP")
					.addParameter("result_type", "street_address")
					.addParameter("language", "pt-BR")
					.addParameter("key", chamaiProperty.getGoogleMapsApiKey())
				.build();
		
		try {
			CloseableHttpResponse response = httpClient.execute(request);
			
			HttpEntity entity = response.getEntity();
			
			GeocodeApi geocodeApi = new GeocodeApi();
			if (entity != null) {
				Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
				geocodeApi = gson.fromJson(EntityUtils.toString(entity), GeocodeApi.class);
			}
			
			return geocodeApi;
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		} finally {
			httpClient.close();
		}
	}
	
}