package br.com.chamai.util.maps.directions;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter @Setter
public class Leg {

	private Distance distance;
	private Duration duration;
	private String endAddress;
	private EndLocation endLocation;
	private String startAddress;
	private StartLocation startLocation;

}
