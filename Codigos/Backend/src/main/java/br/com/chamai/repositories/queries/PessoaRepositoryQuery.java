package br.com.chamai.repositories.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.filters.PessoaFilter;

public interface PessoaRepositoryQuery {

	public Page<Pessoa> filtrar(PessoaFilter filter, Pageable pageable);
	
}
