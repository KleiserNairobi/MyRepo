package br.com.chamai.util.osm;

import com.atlis.location.model.impl.Address;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OpenStreetMapResponse {
	
	private String url;
  private String error;
  private String display_name;
  private String licence;
  private String place_id;
  private Double lon;
  private Address address;
  private String osm_id;
  private String osm_type;
  private Double lat;
  
  
  /**
   * Response example:
   *
   * {
   * "place_id":"63949160", "licence":"Data © OpenStreetMap contributors, ODbL
   * 1.0. http:\/\/www.openstreetmap.org\/copyright", "osm_type":"way",
   * "osm_id":"34958053", "lat":"40.7903088", "lon":"-73.9599513",
   * "display_name":"97th Street Transverse, Park West Village, Manhattan, New
   * York County, New York City, New York, 10029, United States of America",
   * "address":{ "road":"97th Street Transverse", "neighbourhood":"Park West
   * Village", "suburb":"Manhattan", "county":"New York County", "city":"New
   * York City", "state":"New York", "postcode":"10029", "country":"United
   * States of America", "country_code":"us" } }
   */

}
