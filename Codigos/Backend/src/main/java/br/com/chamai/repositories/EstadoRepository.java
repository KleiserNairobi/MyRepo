package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.chamai.models.Estado;
import br.com.chamai.repositories.queries.EstadoRepositoryQuery;

public interface EstadoRepository extends JpaRepository<Estado, String>, EstadoRepositoryQuery {

}
