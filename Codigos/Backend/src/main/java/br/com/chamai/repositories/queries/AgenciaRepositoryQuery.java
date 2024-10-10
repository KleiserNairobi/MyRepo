package br.com.chamai.repositories.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.chamai.models.Agencia;
import br.com.chamai.repositories.filters.AgenciaFilter;

public interface AgenciaRepositoryQuery {

	public Page<Agencia> filtrar(AgenciaFilter filter, Pageable pageable);
	
}
