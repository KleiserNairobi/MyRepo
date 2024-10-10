package br.com.chamai.services;

import java.util.List;
import java.util.Objects;

import br.com.chamai.models.Municipio;
import br.com.chamai.models.dto.AgendamentoEnderecoDto;
import br.com.chamai.models.enums.TipoEndereco;
import br.com.chamai.util.validators.ValidationMethods;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.AgendamentoEndereco;
import br.com.chamai.repositories.AgendamentoEnderecoRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AgendamentoEnderecoService {
	
	@Autowired private AgendamentoEnderecoRepository repository;
	@Autowired private MunicipioService municipioService;
	
	public List<AgendamentoEndereco> findAll() {
		return repository.findAll();
	}
	
	public AgendamentoEndereco find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de agendamento de entrega com o id " + id)
		);
	}

	@Transactional
	public AgendamentoEndereco insert(AgendamentoEndereco entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		if (entity.getAgendamento() == null || entity.getAgendamento().getId() == null) {
			throw new EntidadeNaoEncontrada("Agendamento não informado");
		}
		return repository.save(entity);
	}

	@Transactional
	public AgendamentoEndereco update(AgendamentoEndereco entity, Long id) {
		AgendamentoEndereco agendamentoEntrega = find(id);
		BeanUtils.copyProperties(entity, agendamentoEntrega, "id");
		return repository.save(agendamentoEntrega);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}

	public boolean isOrigemInList(List<AgendamentoEnderecoDto> listaEntregaEnderecos) {
		for (AgendamentoEnderecoDto obj : listaEntregaEnderecos) {
			if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.O)) {
				return true;
			}
		}
		return false;
	}

	public boolean isDestinoInList(List<AgendamentoEnderecoDto> listaEntregaEnderecos) {
		for (AgendamentoEnderecoDto obj : listaEntregaEnderecos) {
			if (Objects.equals(obj.getTipoEndereco(), TipoEndereco.D)) {
				return true;
			}
		}
		return false;
	}

	public boolean isValidListAgendamentoEnderecoToPersist(List<AgendamentoEnderecoDto> listaEntregaEnderecos) {
		for (AgendamentoEnderecoDto agendamentoEndereco : listaEntregaEnderecos) {
			if (!ValidationMethods.isValidStringToPersist(agendamentoEndereco.getLogradouro(), 100)) {
				return false;
			}
			if (agendamentoEndereco.getTipoEndereco() == null) {
				return false;
			}
		}
		return true;
	}

	public boolean isValidAgendamentoEnderecoToPersist(AgendamentoEndereco agendamentoEndereco) {
		if (!ValidationMethods.isValidStringToPersist(agendamentoEndereco.getLogradouro(), 100)) {
			return false;
		}
		if (agendamentoEndereco.getTipoEndereco() == null) {
			return false;
		}
		return true;
	}

	public boolean isValidAgendamentoEnderecoToPersist(AgendamentoEndereco agendamentoEndereco, boolean validarAgendamento) {
		if (validarAgendamento) {
			if (agendamentoEndereco.getAgendamento() == null || agendamentoEndereco.getAgendamento().getId() == null || agendamentoEndereco.getAgendamento().getId() == 0) {
				return false;
			}
		}
		return this.isValidAgendamentoEnderecoToPersist(agendamentoEndereco);
	}

	public AgendamentoEndereco copyPropertiesToAgendamentoEndereco(AgendamentoEnderecoDto agendamentoEndereco) {
		AgendamentoEndereco newAgendamentoEndereco = new AgendamentoEndereco();
		BeanUtils.copyProperties(agendamentoEndereco, newAgendamentoEndereco);
		Municipio municipio = municipioService.find(agendamentoEndereco.getMunicipio().getId());
		newAgendamentoEndereco.setMunicipio(municipio);
		newAgendamentoEndereco.setLogradouro(agendamentoEndereco.getLogradouro().toUpperCase());
		newAgendamentoEndereco.setBairro(agendamentoEndereco.getBairro().toUpperCase());

		if (!StringUtils.isEmpty(agendamentoEndereco.getNumero())) {
			newAgendamentoEndereco.setNumero(agendamentoEndereco.getNumero().toUpperCase());
		}
		if (!StringUtils.isEmpty(agendamentoEndereco.getComplemento())) {
			newAgendamentoEndereco.setComplemento(agendamentoEndereco.getComplemento().toUpperCase());
		}
		if (!StringUtils.isEmpty(agendamentoEndereco.getReferencia())) {
			newAgendamentoEndereco.setReferencia(agendamentoEndereco.getReferencia().toUpperCase());
		}
		if (!StringUtils.isEmpty(agendamentoEndereco.getContato())) {
			newAgendamentoEndereco.setContato(agendamentoEndereco.getContato().toUpperCase());
		}
		if (!StringUtils.isEmpty(agendamentoEndereco.getTelefone())) {
			newAgendamentoEndereco.setTelefone(agendamentoEndereco.getTelefone().toUpperCase());
		}
		if (!StringUtils.isEmpty(agendamentoEndereco.getTarefa())) {
			newAgendamentoEndereco.setTarefa(agendamentoEndereco.getTarefa().toUpperCase());
		}
		return newAgendamentoEndereco;
	}

}
