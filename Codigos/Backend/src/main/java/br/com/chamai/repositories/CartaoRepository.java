package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.chamai.models.Cartao;

public interface CartaoRepository extends JpaRepository<Cartao, Long> {

}
