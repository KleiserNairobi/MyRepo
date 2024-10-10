package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.chamai.models.Aprovacao;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AprovacaoRepository extends JpaRepository<Aprovacao, Long> {

    @Query(" from Aprovacao where statusAprovacao <> 'A' ")
    List<Aprovacao> findAll();

}
