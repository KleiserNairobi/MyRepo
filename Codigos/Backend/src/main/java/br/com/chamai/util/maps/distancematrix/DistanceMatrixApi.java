package br.com.chamai.util.maps.distancematrix;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class DistanceMatrixApi {

	private List<String> destinationAddresses;
	private List<String> originAddresses;
	private List<Row> rows;

}
