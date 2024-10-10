package br.com.chamai.util.maps.geocode;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressComponent {

	private String longName;
	private String shortName;
	private List<String> types = null;

}