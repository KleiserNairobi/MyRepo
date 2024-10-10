package br.com.chamai.util.maps.directions;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Route {

	private Bounds bounds;
	private String copyrights;
	private List<Leg> legs;
	private String summary;
	private List<Object> warnings;
	private List<Object> waypointOrder;

}
