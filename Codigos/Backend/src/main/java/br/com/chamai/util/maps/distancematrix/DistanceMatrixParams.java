package br.com.chamai.util.maps.distancematrix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class DistanceMatrixParams {
	
	private String origin;
	private String destination;
	private String mode;

}
