package br.com.chamai.repositories.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.chamai.models.Estado;
import br.com.chamai.repositories.filters.EstadoFilter;

public interface EstadoRepositoryQuery {

	public Page<Estado> filtrar(EstadoFilter filter, Pageable pageable);
	
}
