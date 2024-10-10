package br.com.chamai.configs.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.chamai.models.Usuario;
import br.com.chamai.repositories.UsuarioRepository;

@Service
public class AppUserDetailService implements UserDetailsService {

	@Autowired private UsuarioRepository repository;
	
	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		Optional<Usuario> optional = repository.findByLogin(login);
		if (!optional.isPresent() || optional.get().getAtivo() == null || optional.get().getAtivo() == false) {
			throw new UsernameNotFoundException("Usuário não encontrado ou inativo");
		}
		
		Usuario usuario = optional.get();
		usuario.setLogin(login);
		return new UsuarioSistema(usuario, getPermissoes(usuario));
	}

	private Collection<? extends GrantedAuthority> getPermissoes(Usuario usuario) {
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		usuario.getPermissoes().forEach(p -> authorities.add(new SimpleGrantedAuthority(p.getNome().toUpperCase())));
		return authorities;
	}

}
