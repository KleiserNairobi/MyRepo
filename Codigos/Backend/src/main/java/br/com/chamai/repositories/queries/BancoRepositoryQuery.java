package br.com.chamai.repositories.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.chamai.models.Banco;
import br.com.chamai.repositories.filters.BancoFilter;

public interface BancoRepositoryQuery {

	public Page<Banco> filtrar(BancoFilter filter, Pageable pageable);
	
}
