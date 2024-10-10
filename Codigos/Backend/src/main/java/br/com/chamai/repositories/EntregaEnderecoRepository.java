package br.com.chamai.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.models.Entrega;
import br.com.chamai.models.EntregaEndereco;

public interface EntregaEnderecoRepository extends JpaRepository<EntregaEndereco, Long> {
	
	@Query(" from EntregaEndereco " +
			"where entrega = :entrega " +
			"order by id ")
	List<EntregaEndereco> findByEntrega(Entrega entrega);

	@Query(value = "select ee.* from entrega_endereco ee " +
			"where ee.entrega_id = :idEntrega " +
			"order by ee.id ", nativeQuery = true)
	List<EntregaEndereco> findByEntrega(Long idEntrega);
	
	@Modifying
	@Transactional(readOnly = false)
	@Query("DELETE FROM EntregaEndereco ee WHERE ee.entrega = :entrega")
	void deleteByEntrega(@Param("entrega") Entrega entrega);
	
}
