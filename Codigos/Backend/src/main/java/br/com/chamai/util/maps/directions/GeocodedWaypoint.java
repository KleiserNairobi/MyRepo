package br.com.chamai.util.maps.directions;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class GeocodedWaypoint {

	private String geocoderStatus;
	private String placeId;
	private List<String> types = null;
	private Boolean partialMatch;

}
