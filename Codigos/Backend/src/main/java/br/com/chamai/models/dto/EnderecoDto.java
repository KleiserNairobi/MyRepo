package br.com.chamai.models.dto;

import java.util.List;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.chamai.util.maps.geocode.GeocodeApi;
import br.com.chamai.util.maps.geocode.AddressComponent;
import br.com.chamai.util.maps.geocode.Result;
import br.com.chamai.util.postmon.PostmonApi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@ToString
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnderecoDto {
	
	private String enderecoFormatado;
	private String cep;
	private String logradouro;
	private String complemento;
	private String bairro;
	private String cidade;
	private String estado;
	private String unidade;
	private String ibge;
	private String gia;
	
	@JsonIgnore
	private boolean isCobertura;
	
	private Long cidadeId;
	
	public static EnderecoDto enderecoDtoFromPostmonApi(PostmonApi postmonApi) {
		if (postmonApi == null) {
			return null;
		}
		EnderecoDto enderecoDto = new EnderecoDto();
		BeanUtils.copyProperties(postmonApi, enderecoDto);
		return enderecoDto;
	}
	
	public static EnderecoDto enderecoDtoFromGeocodeApi(GeocodeApi geocodeApi) {
		if (geocodeApi == null) {
			return null;
		}
		List<AddressComponent> addressComponents = listAddressComponent(geocodeApi.getResults());
		if (addressComponents == null) {
			return null;
		}
		
		EnderecoDto enderecoDto = new EnderecoDto();
		enderecoDto.setEnderecoFormatado(geocodeApi.getResults().get(0).getFormattedAddress());
		enderecoDto.setLogradouro(addressComponents.get(1).getLongName() + ", " + addressComponents.get(0).getLongName());
		enderecoDto.setBairro(addressComponents.get(2).getLongName());
		enderecoDto.setCidade(addressComponents.get(3).getLongName());
		enderecoDto.setEstado(addressComponents.get(4).getShortName());
		enderecoDto.setCep(addressComponents.get(6).getLongName());
		
		return enderecoDto;
	}
	
	private static List<AddressComponent> listAddressComponent(List<Result> results) {
		if (results == null || results.size() == 0 || results.get(0) == null || results.get(0).getAddressComponents() == null) {
			return null;
		}
		
		return results.get(0).getAddressComponents();
	}

}
