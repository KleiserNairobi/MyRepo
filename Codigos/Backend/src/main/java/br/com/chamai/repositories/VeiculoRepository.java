package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Veiculo;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    @Query(" from Veiculo v join v.pessoa p order by p.nome, v.tipo, v.modelo  ")
    List<Veiculo> findAll();

    @Query(" from Veiculo v join v.pessoa where v.pessoa = :pessoa ")
    List<Veiculo> findByPessoa(Pessoa pessoa);

    @Query("SELECT v FROM Veiculo v"
  			+ " JOIN FETCH v.pessoa"
  			+ " WHERE v.pessoa = :pessoa AND v.ativo = :isAtivo")
    Optional<Veiculo> findByPessoaAndAtivo(@Param("pessoa") Pessoa pessoa, @Param("isAtivo") Boolean ativo);

    @Modifying
    @Transactional(readOnly = false)
    @Query("update Veiculo set ativo = :isAtivo where id = :id")
    void updateAtivo(@Param("id") Long id, @Param("isAtivo") boolean isAtivo);

}
