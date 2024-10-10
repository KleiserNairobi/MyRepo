package br.com.chamai.util.maps.geocode;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
public class GeocodeApiParams {
	
	private String address;
	private String postalCode;

}
