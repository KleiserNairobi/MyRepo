package br.com.chamai.repositories;

import br.com.chamai.models.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.chamai.models.Foto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FotoRepository extends JpaRepository<Foto, Long> {

    @Query(" from Foto where pessoa = :pessoa order by id ")
    List<Foto> findByPessoa(@Param("pessoa") Pessoa pessoa);

    @Query(value = "select * from Foto where pessoa_id = :idPessoa and tipo_foto = :tipoFoto", nativeQuery = true)
    Optional<Foto> findByPessoaAndTipoFoto(@Param("idPessoa") Long idPessoa, @Param("tipoFoto") String tipoFoto);

}
