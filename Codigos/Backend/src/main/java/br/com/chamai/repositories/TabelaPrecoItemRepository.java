package br.com.chamai.repositories;

import java.sql.Time;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.TabelaPreco;
import br.com.chamai.models.TabelaPrecoItem;

public interface TabelaPrecoItemRepository extends JpaRepository<TabelaPrecoItem, Long> {

	@Query(" from TabelaPrecoItem tpi join tpi.tabelaPreco ")
	List<TabelaPrecoItem> findAll();

	@Query("SELECT tpi FROM TabelaPrecoItem tpi"
			+ " WHERE"
			+ " tpi.tabelaPreco = :tabelaPreco AND :time BETWEEN tpi.horaInicio AND tpi.horaFim")
	List<TabelaPrecoItem> findTabelaPrecoItemByIntervalTimeAndTabelaPreco(
			@Param("time") Time time, @Param("tabelaPreco") TabelaPreco tabelaPreco
	);
	
}
