package br.com.chamai.repositories;

import br.com.chamai.models.ContaReceber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ContaReceberRepository extends JpaRepository<ContaReceber, Long> {

    @Query(" from ContaReceber r " +
            "join r.pessoa " +
            "join r.categoria " +
            "join r.moeda " +
            "where r.valorReceber > 0 " +
            "order by r.primeiroVcto")
    List<ContaReceber> findAll();

}
