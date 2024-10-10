package br.com.chamai.util.maps.directions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DirectionsApiParams {
	
	private String origin;
	private String destination;
	private String mode;
	private String waypoints;
	
}