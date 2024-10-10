package br.com.chamai.util.maps.geocode;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeocodeApi {

	private List<Result> results = null;
	private String status;

}