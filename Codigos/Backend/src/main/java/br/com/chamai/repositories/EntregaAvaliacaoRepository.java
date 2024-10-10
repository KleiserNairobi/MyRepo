package br.com.chamai.repositories;

import br.com.chamai.models.EntregaAvaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EntregaAvaliacaoRepository extends JpaRepository<EntregaAvaliacao, Long> {

    @Query(" from EntregaAvaliacao ea join fetch ea.entrega join fetch ea.pessoa ")
    List<EntregaAvaliacao> findAll();

}
