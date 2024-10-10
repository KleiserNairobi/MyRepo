package br.com.chamai.util.maps.directions;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class DirectionsApi {

	private List<GeocodedWaypoint> geocodedWaypoints;
	private List<Route> routes;
	private String status;

}