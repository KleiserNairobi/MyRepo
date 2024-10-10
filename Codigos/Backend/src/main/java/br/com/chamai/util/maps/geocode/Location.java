package br.com.chamai.util.maps.geocode;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter
@Setter
public class Location {

	private Double lat;
	private Double lng;

}