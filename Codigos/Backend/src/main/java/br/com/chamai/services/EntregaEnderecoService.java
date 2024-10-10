package br.com.chamai.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import br.com.chamai.models.Municipio;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Entrega;
import br.com.chamai.models.EntregaEndereco;
import br.com.chamai.models.dto.EntregaEnderecoDto;
import br.com.chamai.models.enums.TipoEndereco;
import br.com.chamai.repositories.EntregaEnderecoRepository;
import br.com.chamai.util.validators.ValidationMethods;

@Service
public class EntregaEnderecoService {

	@Autowired EntregaEnderecoRepository repository;
	@Autowired MunicipioService municipioService;
	
	public List<EntregaEndereco> findAll() {
		return repository.findAll();
	}
	
	public EntregaEndereco find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de entrega endereço com o id " + id)
		);
	}

	public List<EntregaEndereco> findByEntrega(Long idEntrega) {
		return repository.findByEntrega(idEntrega);
	}

	public EntregaEndereco findByEntrega(Entrega entrega) {
		List<EntregaEndereco> listEnderecos = repository.findByEntrega(entrega);
		if (listEnderecos.isEmpty()) {
			return null;
		}
		for (EntregaEndereco obj : listEnderecos) {
			if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
				return obj;
			}
		}
		return null;
	}
	
	public List<EntregaEndereco> listByEntrega(Entrega entrega) {
		List<EntregaEndereco> listEnderecos = repository.findByEntrega(entrega);
		if (listEnderecos == null || listEnderecos.isEmpty()) {
			return new ArrayList<>();
		}
		return listEnderecos;
	}

	@Transactional
	public EntregaEndereco insert(EntregaEndereco entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		return repository.save(entity);
	}

	@Transactional
	public EntregaEndereco update(EntregaEndereco entity, Long id) {
		EntregaEndereco entrega = find(id);
		BeanUtils.copyProperties(entity, entrega, "id");
		return repository.save(entrega);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}
	
	public boolean isOrigemInList(List<EntregaEnderecoDto> listaEntregaEnderecos) {
		for (EntregaEnderecoDto obj : listaEntregaEnderecos) {
			if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
				return true;
			}
		}
		return false;
	}
	
	public boolean isDestinoInList(List<EntregaEnderecoDto> listaEntregaEnderecos) {
		for (EntregaEnderecoDto obj : listaEntregaEnderecos) {
			if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.D)) {
				return true;
			}
		}
		return false;
	}

	public EntregaEndereco copyPropertiesToEntregaEndereco(EntregaEnderecoDto entregaEndereco) {
		EntregaEndereco newEntregaEndereco = new EntregaEndereco();
		BeanUtils.copyProperties(entregaEndereco, newEntregaEndereco);
		Municipio municipio = municipioService.find(entregaEndereco.getMunicipio().getId());
		newEntregaEndereco.setMunicipio(municipio);
		newEntregaEndereco.setLogradouro(entregaEndereco.getLogradouro().toUpperCase());
		newEntregaEndereco.setBairro(entregaEndereco.getBairro().toUpperCase());

		if (!StringUtils.isEmpty(entregaEndereco.getNumero())) {
			newEntregaEndereco.setNumero(entregaEndereco.getNumero().toUpperCase());
		}
		if (!StringUtils.isEmpty(entregaEndereco.getComplemento())) {
			newEntregaEndereco.setComplemento(entregaEndereco.getComplemento().toUpperCase());
		}
		if (!StringUtils.isEmpty(entregaEndereco.getReferencia())) {
			newEntregaEndereco.setReferencia(entregaEndereco.getReferencia().toUpperCase());
		}
		if (!StringUtils.isEmpty(entregaEndereco.getContato())) {
			newEntregaEndereco.setContato(entregaEndereco.getContato().toUpperCase());
		}
		if (!StringUtils.isEmpty(entregaEndereco.getTelefone())) {
			newEntregaEndereco.setTelefone(entregaEndereco.getTelefone().toUpperCase());
		}
		if (!StringUtils.isEmpty(entregaEndereco.getTarefa())) {
			newEntregaEndereco.setTarefa(entregaEndereco.getTarefa().toUpperCase());
		}

		return newEntregaEndereco;
	}
	
	public EntregaEndereco copyPropertiesToEntregaEndereco(Entrega entity, EntregaEndereco entregaEndereco) {
		EntregaEndereco newEntregaEndereco = new EntregaEndereco();
		BeanUtils.copyProperties(entregaEndereco, newEntregaEndereco, "entrega");
		Entrega entrega = new Entrega();
		BeanUtils.copyProperties(entity, entrega);
		newEntregaEndereco.setEntrega(entrega);
		return newEntregaEndereco;
	}
	
	public boolean isValidListEntregaEnderecoToPersist(List<EntregaEnderecoDto> listaEntregaEnderecos) {
		for (EntregaEnderecoDto entregaEndereco : listaEntregaEnderecos) {			
			if (!ValidationMethods.isValidStringToPersist(entregaEndereco.getLogradouro(), 100)) {
				return false;
			}
			if (entregaEndereco.getTipoEndereco() == null) {
				return false;
			}
		}
		return true;
	}
	
	public boolean isValidEntregaEnderecoToPersist(EntregaEndereco entregaEndereco) {
		if (!ValidationMethods.isValidStringToPersist(entregaEndereco.getLogradouro(), 100)) {
			return false;
		}
		if (entregaEndereco.getTipoEndereco() == null) {
			return false;
		}
		return true;
	}
	
	public boolean isValidEntregaEnderecoToPersist(EntregaEndereco entregaEndereco, boolean validarEntrega) {
		if (validarEntrega) {
			if (entregaEndereco.getEntrega() == null || entregaEndereco.getEntrega().getId() == null || entregaEndereco.getEntrega().getId() == 0) {
				return false;
			}
		}
		return this.isValidEntregaEnderecoToPersist(entregaEndereco);
	}
	
}
