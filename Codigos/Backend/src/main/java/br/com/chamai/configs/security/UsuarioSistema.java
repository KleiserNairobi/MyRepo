package br.com.chamai.configs.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import br.com.chamai.models.Usuario;
import lombok.Getter;

public class UsuarioSistema extends User {
	
	@Getter
	private Usuario usuario;

	public UsuarioSistema(Usuario usuario, Collection<? extends GrantedAuthority> authorities) {
		super(usuario.getLogin(), usuario.getSenha(), authorities);
		this.usuario = usuario;
	}

	private static final long serialVersionUID = 1L;

}
