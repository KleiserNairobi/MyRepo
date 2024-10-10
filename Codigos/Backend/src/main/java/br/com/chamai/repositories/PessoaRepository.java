package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import br.com.chamai.models.EstatisticaEntregador;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.repositories.queries.PessoaRepositoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


public interface PessoaRepository extends JpaRepository<Pessoa, Long>, PessoaRepositoryQuery {

    @Query("select count(p.id) > 0 from Pessoa p where p.email = :email")
    Boolean emailJaCadastrado(@Param("email") String email);

    @Query("select count(p.id) > 0 from Pessoa p where p.telefone = :telefone")
    Boolean telefoneJaCadastrado(@Param("telefone") String telefone);

    @Query("select count(p.id) > 0 from Pessoa p where p.email = :email or p.telefone = :telefone")
    Boolean EmailOuTelefoneJaCadastrado(@Param("email") String email, @Param("telefone") String telefone);

    @Query("from Pessoa p where p.email = :email")
    Pessoa findByEmail(@Param("email") String email);

    @Query("from Pessoa p where p.telefone = :telefone")
    Pessoa findByTelefone(@Param("telefone") String telefone);

    @Query("from Pessoa p where p.cliente = true order by p.nome ")
    List<Pessoa> findByClientes();
    // Deve-se levar em consideração o município

    @Query("from Pessoa p where p.entregador = true order by p.nome ")
    List<Pessoa> findByEntregadores();
    // Deve-se levar em consideração o município

    @Query("from Pessoa p where p.colaborador = true order by p.nome ")
    List<Pessoa> findByColaboradores();
    // Deve-se levar em consideração o município

    @Query("from Pessoa p where p.parceiro = true order by p.nome ")
    List<Pessoa> findByParceiros();
    // Deve-se levar em consideração o município
    
    @Transactional(readOnly = false)
    @Modifying
    @Query("UPDATE Pessoa SET online = :isOnline WHERE id = :id")
    void updateOnline(@Param("id") Long id, @Param("isOnline") boolean isOnline);
    
    @Query("SELECT l FROM Localizacao l"
    			+ " INNER JOIN Pessoa p ON l.pessoa = p.id"
    			+ " WHERE p.id = :id AND p.entregador = true AND l.data = CURRENT_DATE")
    Optional<Localizacao> findLocalizacaoEntregadorDataAtual(@Param("id") Long id);
    
    @Query("SELECT p.nome FROM Pessoa p WHERE p.email = :email")
    Optional<String> findNomeByEmail(@Param("email") String email);
    
    @Query("SELECT p.nome FROM Pessoa p WHERE p.telefone = :telefone")
    Optional<String> findNomeByTelefone(@Param("telefone") String telefone);
    
    @Query("SELECT p FROM Pessoa p"
				+ " WHERE p.id = :id")
    List<Pessoa> findAllByPessoa(@Param("id") long idPessoa);

    @Query(value = "select " +
            "count(p.id) as total, " +
            "count(case when p.ativo = true then p.id end) as ativo, " +
            "count(case when p.ativo = false then p.id end) as inativo, " +
            "count(case when p.online = true and p.ativo = true then p.id end) as online, " +
            "count(case when p.online = false and p.ativo = true then p.id end) as offline, " +
            "count(case when p.online = true and p.ativo = true and l.disponivel = true then p.id end) as disponivel, " +
            "count(case when p.online = true and p.ativo = true and l.disponivel = false then p.id end) as ocupado " +
            "from pessoa p " +
            "join endereco e on (e.pessoa_id = p.id) " +
            "left join localizacao l on (l.pessoa_id = p.id) " +
            "where p.entregador = true " +
            "and e.proprio = true " +
            "and e.municipio_id = :idMunicipio ", nativeQuery = true)
    Optional<EstatisticaEntregador> getEstatiscaEntregadorByMunicipio(@Param("idMunicipio") Long idMunicipio);

}
