package br.com.chamai.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.Categoria;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query(value = "select c from Categoria c order by codigo")
    List<Categoria> findAllWithOrderBy();

}
