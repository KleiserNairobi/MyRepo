package br.com.chamai.repositories;

import br.com.chamai.models.Habilitacao;
import br.com.chamai.models.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HabilitacaoRepository extends JpaRepository<Habilitacao, Long> {

    @Query(" from Habilitacao h join fetch h.pessoa p order by p.nome ")
    List<Habilitacao> findAll();

    @Query(" from Habilitacao h join fetch h.pessoa where h.pessoa = :pessoa ")
    Optional<Habilitacao> findByPessoa(@Param("pessoa") Pessoa pessoa);

}
