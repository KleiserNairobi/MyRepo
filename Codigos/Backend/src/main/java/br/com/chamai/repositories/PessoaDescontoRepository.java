package br.com.chamai.repositories;

import br.com.chamai.models.PessoaDesconto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PessoaDescontoRepository extends JpaRepository<PessoaDesconto, Long> {

    @Query(" from PessoaDesconto pd " +
            "join fetch pd.pessoa " +
            "join fetch pd.desconto")
    List<PessoaDesconto> findAll();

    @Query(" from PessoaDesconto pd " +
            "join fetch pd.pessoa p " +
            "join fetch pd.desconto d " +
            "where p.id = :idPessoa " +
            "and d.id = :idDesconto")
    Optional<PessoaDesconto> findByPessoaAndDesconto(
            @Param("idPessoa") Long idPessoa,
            @Param("idDesconto") Long idDesconto
    );

}
