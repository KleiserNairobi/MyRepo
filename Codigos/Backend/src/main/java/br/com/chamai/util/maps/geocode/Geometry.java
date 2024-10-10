package br.com.chamai.util.maps.geocode;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Geometry {

	private Bounds bounds;
	private Location location;
	private String locationType;
	private Viewport viewport;

}