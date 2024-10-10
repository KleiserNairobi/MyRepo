package br.com.chamai.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import org.springframework.transaction.annotation.Transactional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	@Query("from Usuario u join u.pessoa p order by p.nome, u.nome")
	List<Usuario> findAll();

	@Query("SELECT u FROM Usuario u "
				+ "JOIN FETCH u.pessoa "
				+ "WHERE u.pessoa = :pessoa")
	List<Usuario> findAllByPessoa(@Param("pessoa") Pessoa pessoa);

	@Query(value = "select u.* from usuario u where u.email = :login or u.telefone = :login", nativeQuery = true)
	Optional<Usuario> findByLogin(String login);

	@Query("from Usuario u where u.email = :email")
	Optional<Usuario> findByEmail(String email);

	List<Usuario> findByPessoa(Pessoa pessoa);
  
	@Query(value = "select u.id from usuario u"
			+ " join pessoa p on (u.pessoa_id = p.id)"
			+ " where p.id = :entregador and p.entregador = true"
			+ " limit 1", nativeQuery = true)
  	Optional<Long> getIdUsuarioByEntregadorId(@Param("entregador") long idEntregador);
	
	@Query(value = "select u.id from usuario u"
			+ " join pessoa p on (u.pessoa_id = p.id)"
			+ " where p.id = :cliente and p.cliente = true"
			+ " limit 1", nativeQuery = true)
	Optional<Long> getIdUsuarioByClienteId(@Param("cliente") long idCliente);

	@Modifying
	@Transactional(readOnly = false)
	@Query("update Usuario set senha = :novaSenha where id = :id")
	void updateSenha(@Param("id") Long id, @Param("novaSenha") String senha);

}
