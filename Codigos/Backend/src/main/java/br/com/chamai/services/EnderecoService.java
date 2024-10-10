package br.com.chamai.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import br.com.chamai.models.dto.EnderecoCadDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.atlis.location.model.impl.Address;
import com.atlis.location.model.impl.MapPoint;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.Endereco;
import br.com.chamai.models.Municipio;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.dto.EnderecoDto;
import br.com.chamai.repositories.EnderecoRepository;
import br.com.chamai.util.osm.OpenStreetMapRequests;
import br.com.chamai.util.postmon.PostmonRequests;
import br.com.chamai.util.validators.ValidationMethods;
import br.com.chamai.util.viacep.ViaCepRequests;


@Service
public class EnderecoService {
	
	@Autowired private EnderecoRepository enderecoRepository;
	@Autowired private PessoaService pessoaService;
	@Autowired private ViaCepRequests viaCepRequests;
	@Autowired private PostmonRequests postmonRequests;
	@Autowired private MunicipioService municipioService;

	public MapPoint buscarEnderecoPorCepOSM(Address address) throws Exception {
		String endpointUrl = "https://nominatim.openstreetmap.org/";
		MapPoint mapPoint = OpenStreetMapRequests.with(endpointUrl).getMapPointFromAddress(address, 5);
		return mapPoint;
	}

	public EnderecoDto buscarEnderecoPorCep(String cep) throws Exception {
		EnderecoDto enderecoDto = EnderecoDto.enderecoDtoFromPostmonApi(postmonRequests.buscarCep(cep));
		if (enderecoDto == null) {
			throw new EntidadeNaoEncontrada("CEP não encontrado");
		}
		if (StringUtils.isEmpty(enderecoDto.getCidade())) {
			throw new EntidadeNaoEncontrada("Município não encontrado");
		}
		if (StringUtils.isEmpty(enderecoDto.getEstado())) {
			throw new EntidadeNaoEncontrada("Estado não encontrado");
		}
		
		Municipio municipio = municipioService.findByNomeAndEstado(enderecoDto.getCidade(), enderecoDto.getEstado());
		enderecoDto.setCidadeId(municipio.getId());
		
		return enderecoDto;
	}

	public List<Endereco> findAll() {
		return enderecoRepository.findAll();
	}

	public Endereco find(Long id) {
		Optional<Endereco> optional = enderecoRepository.findById(id);
		if (!optional.isPresent()) {
			throw new EntidadeNaoEncontrada("Endereço não encontrado");
		}
		return optional.get();
	}

	public Endereco findProprioByPessoa(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		Optional<Endereco> endereco = enderecoRepository.findProprioByPessoa(pessoa);
		if (!endereco.isPresent()) {
			throw new EntidadeNaoEncontrada("Nenhum endereço próprio registrado para o membro " + idPessoa);
		}
		return endereco.get();
	}
	
	public List<Endereco> listEnderecos(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		return enderecoRepository.findByPessoa(pessoa);
	}

	public List<Endereco> listEnderecosCoberturaMunicipio(Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		long qtde = enderecoRepository.countByPessoa(pessoa);
		List<Endereco> enderecos = enderecoRepository.findByPessoaAndCobertura(pessoa.getId(), true);

		if (enderecos.isEmpty() && qtde > 0) {
			throw new ExcecaoTempoExecucao("Nenhum endereço constante no seu cadastro corresponde " +
					"a um município que a Chamaí atua. Caso esteja em um município diferente do seu " +
					"município de origem, e este consta na lista de municípios atendidos pelo Chamaí, " +
					"digite um endereço novo ou utilize a geolocalização para capturar o seu endereço. "
			);
		}

		return enderecos;
	}

	public List<Endereco> insertAddresses(List<Endereco> entities, Long idPessoa) {
		List<Endereco> enderecos = new ArrayList<Endereco>();
		Pessoa pessoa = pessoaService.find(idPessoa);
		entities.forEach(entity -> {
			entity.setPessoa(pessoa);
			Endereco endereco = enderecoRepository.save(entity);
			enderecos.add(endereco);
		});
		return enderecos;
	}

	@Transactional
	public Endereco insert(EnderecoCadDto entity) {
		Pessoa pessoa = pessoaService.find(entity.getIdPessoa());

		Municipio municipio = municipioService.findByNomeAndEstado(
				entity.getMunicipio().toUpperCase(),
				entity.getEstado().toUpperCase()
		);

		Endereco endereco = new Endereco();
		endereco.setAtivo(true);
		endereco.setPessoa(pessoa);
		endereco.setCep(entity.getCep());
		endereco.setLogradouro(entity.getLogradouro().toUpperCase());
		endereco.setNumero(entity.getNumero().toUpperCase());
		endereco.setComplemento(entity.getComplemento().toUpperCase());
		endereco.setBairro(entity.getBairro().toUpperCase());
		endereco.setMunicipio(municipio);
		endereco.setLatitude(null);
		endereco.setLongitude(null);
		endereco.setTelefoneCliente(entity.getTelefoneCliente());

		if (!StringUtils.isEmpty(entity.getNomeCliente())) {
			endereco.setNomeCliente(entity.getNomeCliente().toUpperCase());
		}

		if (!StringUtils.isEmpty(entity.getReferencia())) {
			endereco.setReferencia(entity.getReferencia().toUpperCase());
		}

		if (entity.getProprio() != null && entity.getProprio()) {
			endereco.setProprio(entity.getProprio());
		}

		return enderecoRepository.save(endereco);
	}

	@Transactional
	public Endereco update(EnderecoCadDto entity, Long id) {
		Endereco endereco = find(id);
		Pessoa pessoa = pessoaService.find(entity.getIdPessoa());

		Municipio municipio = municipioService.findByNomeAndEstado(
				entity.getMunicipio().toUpperCase(),
				entity.getEstado().toUpperCase()
		);

		endereco.setPessoa(pessoa);
		endereco.setCep(entity.getCep());
		endereco.setLogradouro(entity.getLogradouro().toUpperCase());
		endereco.setNumero(entity.getNumero().toUpperCase());
		endereco.setComplemento(entity.getComplemento().toUpperCase());
		endereco.setBairro(entity.getBairro().toUpperCase());
		endereco.setMunicipio(municipio);
		endereco.setLatitude(null);
		endereco.setLongitude(null);
		endereco.setTelefoneCliente(entity.getTelefoneCliente());

		if ( !StringUtils.isEmpty(entity.getNomeCliente()) ) {
			endereco.setNomeCliente(entity.getNomeCliente().toUpperCase());
		}
		if ( !StringUtils.isEmpty(entity.getReferencia()) ) {
			endereco.setReferencia(entity.getReferencia().toUpperCase());
		}

		return enderecoRepository.save(endereco);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		enderecoRepository.deleteById(id);
	}



	public Endereco insertAddress(Endereco entity, Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		entity.setPessoa(pessoa);
		return enderecoRepository.save(entity);
	}

	public void updateAddresses(List<Endereco> entities, Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		enderecoRepository.deleteByPessoa(pessoa);
		entities.forEach(entity -> {
			entity.setPessoa(pessoa);
			enderecoRepository.save(entity);
		});
		
	}
	
	public void updateAddress(Endereco entity, Long idPessoa) {
		Pessoa pessoa = pessoaService.find(idPessoa);
		entity.setPessoa(pessoa);
		enderecoRepository.save(entity);
	}
	
	public void deleteAdress(Long id) {
		find(id);
		enderecoRepository.deleteById(id);
	}

	public Endereco copyPropertiesEnderecoFromPessoa(Pessoa entity) {
		Endereco endereco = new Endereco();
		//BeanUtils.copyProperties(entity.getEndereco(), endereco, "pessoa");
		//Pessoa pessoa = new Pessoa();
		//BeanUtils.copyProperties(entity, pessoa, "endereco");
		//endereco.setPessoa(pessoa);
		return endereco;
	}
	
	public boolean isValidEnderecoToPersist(Endereco endereco) {
		if (!ValidationMethods.isValidCep(endereco.getCep())) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(endereco.getLogradouro(), 60)) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(endereco.getNumero(), 10)) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(endereco.getComplemento(), 60)) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(endereco.getBairro(), 60)) {
			return false;
		}
		if (!StringUtils.isEmpty(endereco.getReferencia()) && endereco.getReferencia().length() > 60) {
			return false;
		}
		if (endereco.getMunicipio() == null || endereco.getMunicipio().getId() == 0) {
			return false;
		}
		if (endereco.getAtivo() == null) {
			return false;
		}
		return true;
	}
	
	public boolean isValidEnderecoToPersist(Endereco endereco, boolean validarPessoa) {
		if (validarPessoa) {
			if (endereco.getPessoa() == null || endereco.getPessoa().getId() == null || endereco.getPessoa().getId() == 0) {
				return false;
			}
		}
		return this.isValidEnderecoToPersist(endereco);
	}

    public List<Endereco> findByPessoa(Pessoa pessoa) {
		return enderecoRepository.findByPessoa(pessoa);
    }
}
