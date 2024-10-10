package br.com.chamai.repositories.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.chamai.models.Municipio;
import br.com.chamai.repositories.filters.MunicipioFilter;

public interface MunicipioRepositoryQuery {

	public Page<Municipio> filtrar(MunicipioFilter filter, Pageable pageable);
	
}
