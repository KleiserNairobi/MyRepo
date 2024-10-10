package br.com.chamai.util.maps.geocode;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Result {

	private List<Object> accessPoints = null;
	private List<AddressComponent> addressComponents = null;
	private String formattedAddress;
	private Geometry geometry;
	private String placeId;
	private List<String> types = null;

}