package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.chamai.models.Banco;
import br.com.chamai.repositories.queries.BancoRepositoryQuery;

public interface BancoRepository extends JpaRepository<Banco, Long>, BancoRepositoryQuery {

}
