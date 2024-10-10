package br.com.chamai.repositories;

import br.com.chamai.models.ContaPagar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ContaPagarRepository extends JpaRepository<ContaPagar, Long> {

    @Query(" from ContaPagar p " +
            "join fetch p.pessoa " +
            "join fetch p.categoria " +
            "join fetch p.moeda " +
            "where p.valorPagar > 0 " +
            "order by p.primeiroVcto")
    List<ContaPagar> findAll();

}
