package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.Gateway;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GatewayRepository extends JpaRepository<Gateway, Long> {

    @Query("from Gateway where ativo = :ativo")
    List<Gateway> findByAtivo(Boolean ativo);

}
