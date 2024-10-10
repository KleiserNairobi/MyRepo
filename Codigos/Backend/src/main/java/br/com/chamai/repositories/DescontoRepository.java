package br.com.chamai.repositories;

import br.com.chamai.models.Desconto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DescontoRepository extends JpaRepository<Desconto, Long> {

    @Query(" from Desconto d where d.codigo = :codCupom ")
    Optional<Desconto> findByCodigo(@Param("codCupom") String codCupom);

}
