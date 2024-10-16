package br.com.chamai.util.osm;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import com.atlis.location.model.impl.Address;
import com.atlis.location.model.impl.MapPoint;
import com.atlis.location.utils.HttpUtlis;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import javafx.util.Pair;

public class OpenStreetMapRequests {
	
	Gson gson = new Gson();

  HttpUtlis httpUtlis = new HttpUtlis();

  String atlisOpenStreetMapWrapperEndpoint;

  HashMap<String, String> atlisOpenStreetMapWrapperQueryParams;

  private static final String URL_LATITUE_PARAMETER = "lat";
  private static final String URL_LONGITUDE_PARAMETER = "lon";
  private static final String URL_SEARCE_QUERY = "q";
  private static final String RESPONSE_FORMAT = "format";
  private static final String URL_ACCEPT_LANGUAGE_PARAMETER = "accept-language";
  private static final String URL_ZOOM_PARAMETER = "zoom";//max zoom
  private static final String URL_OSM_TYPE = "osm_type";//use the node type

  private static final String URL_SUFFIX_FOR_GECODING = "search.php";
  private static final String URL_SUFFIX_FOR_REVERSE_GECODING = "reverse.php";
  private static final String RESPONSE_FORMAT_VALUE = "json";
  private static final String URL_ACCEPT_LANGUAGE_PARAMETER_VALUE = "en";
  private static final String URL_ZOOM_PARAMETER_VALUE = "18";
  private static final String URL_OSM_TYPE_VALUE = "N";

  public void initNominatimAPI(String endpointUrl) {
      atlisOpenStreetMapWrapperQueryParams = new HashMap<>();
      atlisOpenStreetMapWrapperQueryParams.put(RESPONSE_FORMAT, RESPONSE_FORMAT_VALUE);
      atlisOpenStreetMapWrapperQueryParams.put(URL_ACCEPT_LANGUAGE_PARAMETER, URL_ACCEPT_LANGUAGE_PARAMETER_VALUE);
      atlisOpenStreetMapWrapperQueryParams.put(URL_ZOOM_PARAMETER, URL_ZOOM_PARAMETER_VALUE);
      atlisOpenStreetMapWrapperQueryParams.put(URL_OSM_TYPE, URL_OSM_TYPE_VALUE);
      atlisOpenStreetMapWrapperEndpoint = endpointUrl;
  }

  public static OpenStreetMapRequests with(String endpointUrl) {
  	OpenStreetMapRequests nominatimAPI = new OpenStreetMapRequests();
      nominatimAPI.initNominatimAPI(endpointUrl);
      return nominatimAPI;
  }

  private OpenStreetMapResponse getLocationFrom(MapPoint mapPoint, Address address) {
      if (mapPoint != null
              && (mapPoint.getLatitude() == null
              || mapPoint.getLongitude() == null
              || mapPoint.getLatitude().equals(0.0)
              || mapPoint.getLongitude().equals(0.0))) {
          return null;
      }
      OpenStreetMapResponse openStreetMapResponse = null;
      Pair<String, String> responsePair = null;
      try {
          responsePair = getOpenStreetMap(mapPoint, address, mapPoint != null ? URL_SUFFIX_FOR_REVERSE_GECODING : URL_SUFFIX_FOR_GECODING);
          String responseStr = responsePair.getValue();
          if (responseStr.startsWith("{")) {
              openStreetMapResponse = gson.fromJson(responseStr, OpenStreetMapResponse.class);
          } else {
              List<OpenStreetMapResponse> openStreetMapResponses = gson.fromJson(responseStr, new TypeToken<List<OpenStreetMapResponse>>() {
              }.getType());
              if (openStreetMapResponses == null || openStreetMapResponses.size() < 1) {
                  openStreetMapResponse = null;
              } else {
                  openStreetMapResponse = openStreetMapResponses.get(0);
              }
          }

      } catch (Throwable th) {
//          logger.error("can't get osm response in " + mapPoint + " Or for " + address, th);
      }

      if (responsePair != null && responsePair.getKey() != null && openStreetMapResponse != null) {
          openStreetMapResponse.setUrl(responsePair.getKey());

      }
      return openStreetMapResponse;
  }

  private Pair<String, String> getOpenStreetMap(MapPoint mapPoint, Address address, String urlSuffix) {
      String urlWithLatLon = getOSMUrl(atlisOpenStreetMapWrapperEndpoint + HttpUtlis.URL_DELIMETER + urlSuffix, atlisOpenStreetMapWrapperQueryParams, mapPoint, address);
//      logger.debug("Open street map request url: " + urlWithLatLon);
      String responseStr;
      try {
          HttpsURLConnection connection = (HttpsURLConnection) new URL(urlWithLatLon).openConnection();
          connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");

          responseStr = new BufferedReader(new InputStreamReader(connection.getInputStream())).readLine();
      } catch (IOException e) {
          throw new RuntimeException(e);
      }

//      logger.debug("Open street map response: " + responseStr);
      return new Pair(urlWithLatLon, responseStr);
  }

  public Address getAddressFromMapPoint(MapPoint mapPoint) {

      if (mapPoint == null || mapPoint.getLatitude() == null || mapPoint.getLongitude() == null) {
          return null;
      }

      OpenStreetMapResponse openStreetMapResponse;

      try {
          openStreetMapResponse = getLocationFrom(mapPoint, null);
//          logger.debug("osm response " + openStreetMapResponse);
      } catch (Throwable th) {
//          logger.error("can't get open street map response object we tried to find is lat " + String.valueOf(mapPoint.getLatitude()) + ", lon " + String.valueOf(mapPoint.getLongitude()), th);
          return null;
      }

      if (openStreetMapResponse == null || openStreetMapResponse.getError() != null) {
//          logger.error("can't reverese goeconding location. error from open street map : " + (openStreetMapResponse != null ? openStreetMapResponse.getError() + " url is " + openStreetMapResponse.getUrl() : " open street map error is null") + " object we tried to find is " + String.valueOf(mapPoint.getLatitude()) + ", " + String.valueOf(mapPoint.getLongitude()));
          return null;
      }
      Address address = openStreetMapResponse.getAddress();
      address.setDisplayName(openStreetMapResponse.getDisplay_name());
      address.setCountryCode(address.getCountry_code());
      return address;
  }

  public MapPoint getMapPointFromAddress(Address address, int precision) {
      return getMapPointFromAddress(address.getHousenumber(), address.getStreet(), address.getCity(), address.getState(), address.getCountry(), precision);
  }

  public MapPoint getMapPointFromAddress(String housenumber, String street, String city, String state, String country, int precision) {

      Address address = new Address();
      //we have country, state, city, street and house number - 5 degress of precision
      address.setPrecision(precision);
      address.setCountry(country);
      address.setState(state);
      address.setCity(city);
      address.setStreet(street);
      address.setHousenumber(housenumber);
      OpenStreetMapResponse openStreetMapResponse;
      try {
          openStreetMapResponse = getLocationFrom(null, address);
//          logger.debug("osm response " + openStreetMapResponse);
      } catch (Throwable th) {
//          logger.error("can't get open street map response object we tried to find is " + address, th);
          return null;
      }

      if (openStreetMapResponse == null || openStreetMapResponse.getLat() == null || openStreetMapResponse.getLon() == null || openStreetMapResponse.getError() != null) {
//          logger.info("geocoding response wasn't good enoungh " + openStreetMapResponse);
          if (precision < 2) {
              return null;
          }
          precision = precision - 1;
          return getMapPointFromAddress(housenumber, street, city, state, country, precision);
      }

      return new MapPoint().buildMapPoint(openStreetMapResponse.getLat(), openStreetMapResponse.getLon());
  }

  private String getOSMUrl(String endpoint, Map<String, String> staticParams, MapPoint mapPoint, Address address) {
      HashMap<String, Object> staticParamsForQuery = new HashMap<>(staticParams);
      if (mapPoint != null) {
          staticParamsForQuery.put(URL_LATITUE_PARAMETER, String.valueOf(mapPoint.getLatitude()));
          staticParamsForQuery.put(URL_LONGITUDE_PARAMETER, String.valueOf(mapPoint.getLongitude()));
      }
      if (address != null) {
          //we have country, state, city, street and house number - 5 degress of precision
          int precision = address.getPrecision();
          //let's check max level of precision
          int maxPrecision = getMaxLevelOfPrecision(address);
          if (address.getPrecision() > maxPrecision) {
              precision = maxPrecision;
          }

          address.setPrecision(precision);
          staticParamsForQuery.put(URL_SEARCE_QUERY, buildStringQueryForPrecisionLevel(address));
      }
      return httpUtlis.createURLWithGetParams(endpoint, staticParamsForQuery, false)
              .replace("http://", "https://");
  }

  private int getMaxLevelOfPrecision(Address address) {
      int maxPrecision = 0;
      if (address.getCountry() != null && !address.getCountry().isEmpty()) {
          maxPrecision = maxPrecision + 1;
      }

      if (address.getState() != null && !address.getState().isEmpty()) {
          maxPrecision = maxPrecision + 1;
      }

      if (address.getCity() != null && !address.getCity().isEmpty()) {
          maxPrecision = maxPrecision + 1;
      }

      if (address.getStreet() != null && !address.getStreet().isEmpty()) {
          maxPrecision = maxPrecision + 1;
      }

      if (address.getHousenumber() != null && !address.getHousenumber().isEmpty()) {
          maxPrecision = maxPrecision + 1;
      }
      return maxPrecision;

  }

  private String buildStringQueryForPrecisionLevel(Address address) {
      StringBuilder stringBuilder = null;
      int precision = address.getPrecision();
      if (precision > 4) {
          if (stringBuilder == null) {
              stringBuilder = new StringBuilder();
          } else {
              stringBuilder.append(", ");
          }
          stringBuilder.append(address.getHousenumber());
      }

      if (precision > 3) {
          if (stringBuilder == null) {
              stringBuilder = new StringBuilder();
          } else {
              stringBuilder.append(" ");
          }
          stringBuilder.append(address.getStreet());
      }

      if (precision > 2) {
          if (stringBuilder == null) {
              stringBuilder = new StringBuilder();
          } else {
              stringBuilder.append(", ");
          }
          stringBuilder.append(address.getCity());
      }

      if (precision > 1) {
          if (stringBuilder == null) {
              stringBuilder = new StringBuilder();
          } else {
              stringBuilder.append(", ");
          }
          stringBuilder.append(address.getState());
      }

      if (precision > 0) {
          if (stringBuilder == null) {
              stringBuilder = new StringBuilder();
          } else {
              stringBuilder.append(", ");
          }
          stringBuilder.append(address.getCountry());
      }
      return stringBuilder != null ? stringBuilder.toString() : "";
  }

  /**
   * Overrides default accept language. Languages at:
   * http://wiki.openstreetmap.org/wiki/Nominatim/Country_Codes
   *
   * @param language
   */
  public void setAcceptLanguage(String language) {
      atlisOpenStreetMapWrapperQueryParams.put(URL_ACCEPT_LANGUAGE_PARAMETER, language);
  }

}
