package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.chamai.models.Permissao;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
	
}
