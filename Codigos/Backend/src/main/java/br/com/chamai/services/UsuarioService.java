package br.com.chamai.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import br.com.chamai.models.dto.AlterarSenhaDto;
import br.com.chamai.models.dto.TrocarSenhaDto;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Permissao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.util.UtilMethods;
import br.com.chamai.util.validators.ValidationMethods;

@Service
public class UsuarioService {
	
	@Autowired private UsuarioRepository repository;
	@Autowired private PermissaoService permissaoService;
	@Autowired private PessoaService pessoaService;
	
	public List<Usuario> findAll() {
		Pessoa pessoa = new UtilMethods().getPessoaFromUsuarioLogado();
		if (PessoaService.isCliente(pessoa)
				|| PessoaService.isParceiro(pessoa)
				|| PessoaService.isEntregador(pessoa)) {
			return repository.findAllByPessoa(pessoa)
					.stream()
					.map(u -> {
						u.setSenha(null);
						return u;
					})
					.collect(Collectors.toList());
		}
		if (PessoaService.isColaborador(pessoa)) {
			return repository.findAll();
		}
		return new ArrayList<>();
	}
	
	public Usuario find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de usuário com o id " + id)
		);
	}

	public Usuario findByEmail(String email) {
		return repository.findByEmail(email).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de usuário com o email " + email)
		);
	}

	public Optional<Usuario> findByEmailLoginSocial(String email) {
		return repository.findByEmail(email);
	}

	@Transactional
	public Usuario insert(Usuario entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao(
					"Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
			);
		}
		if (entity.getPessoa().getId() == null) {
			throw new ExcecaoTempoExecucao(
					"Informe o código do Membro."
			);
		}

		Pessoa pessoa = pessoaService.find(entity.getPessoa().getId());
		entity.setPessoa(pessoa);

		if (!entity.getPermissoes().isEmpty()) {
			List<Permissao> permissoes = new ArrayList<>();
			for (int i = 0; i < entity.getPermissoes().size(); i++) {
				Permissao permissao = permissaoService.find(entity.getPermissoes().get(i).getId());
				permissoes.add(permissao);
			}
			entity.setPermissoes(permissoes);
		}

		if (StringUtils.isEmpty(entity.getSenha())) {
			String senha = RandomStringUtils.randomNumeric(6);
			entity.setSenha(UtilMethods.passwordEncoder(senha));
			// deve disparar email de boas vindas incluindo neste a senha do usuário
		} else {
			entity.setSenha(UtilMethods.passwordEncoder(entity.getSenha()));
		}

		if (!StringUtils.isEmpty(entity.getEmail())) {
			entity.setEmail(entity.getEmail().toLowerCase());
		}

		entity.setNome(entity.getNome().toUpperCase());
		repository.save(entity);
		return entity;
	}
	
	private boolean isValidPessoa(Pessoa pessoa) {
		if (StringUtils.isEmpty(pessoa.getTipo())) {
			return false;
		}
		if (!StringUtils.isEmpty(pessoa.getTelefone())) {
			if (!ValidationMethods.isValidTelefone(pessoa.getTelefone())) {
				return false;
			}
		}
		if (!StringUtils.isEmpty(pessoa.getEmail() )) {
			if (!ValidationMethods.isValidEmail(pessoa.getEmail())) {
				return false;
			}
		}
		if (!StringUtils.isEmpty(pessoa.getCpfCnpj())) {
			if (!ValidationMethods.isValidCPF(pessoa.getCpfCnpj())
					&& !ValidationMethods.isValidCNPJ(pessoa.getCpfCnpj())) {
				return false;
			}
		}
		return true;
	}

	@Transactional
	public Usuario update(Usuario entity, Long id) {
		Usuario usuario = find(id);
		BeanUtils.copyProperties(entity, usuario, "id","senha","senhaSocial");
		usuario.setNome(entity.getNome().toUpperCase());
		return repository.save(usuario);
	}

	@Transactional
	public Usuario trocarSenha(TrocarSenhaDto entity) {
		Usuario usuario = findByEmail(entity.getEmail().toLowerCase());
		if (!entity.getCodigo().equals(usuario.getCodigo())) {
			throw new ExcecaoTempoExecucao(
					"Código de recuperação inválido. " +
							"Não foi possível proceder a troca da senha."
			);
		}
		usuario.setCodigo(null);
		usuario.setSenha(UtilMethods.passwordEncoder(entity.getSenha()));
		return repository.save(usuario);
	}

	@Transactional
	public void updateSenhaUsuarioLogado(String senhaAtual, String senhaNova) {
		Usuario usuario = new UtilMethods().getUsuarioLogado().get();

		if (usuario.getId() == null || usuario.getId() <= 0) {
			throw new ExcecaoTempoExecucao("Não foi possível validar o usuário.");
		}

		if (StringUtils.isEmpty(senhaAtual)) {
			throw new ExcecaoTempoExecucao("Senha atual não informada.");
		}

		if (StringUtils.isEmpty(senhaNova)) {
			throw new ExcecaoTempoExecucao("A nova senha não foi informada.");
		} else if (senhaNova.length() < 6) {
			throw new ExcecaoTempoExecucao("A nova senha deve ter no mínimo 6 caracteres.");
		} else if (senhaNova.equals(senhaAtual)) {
			throw new ExcecaoTempoExecucao("A nova senha deve ser diferente da senha atual.");
		}

		if (!new BCryptPasswordEncoder().matches(senhaAtual, usuario.getSenha())) {
			throw new ExcecaoTempoExecucao("A senha atual não confere. Não foi possível alterar a senha.");
		}

		repository.updateSenha(usuario.getId(), UtilMethods.passwordEncoder(senhaNova));
	}

	@Transactional
	public Usuario updateCodigo(Usuario usuario, String codigo) {
		usuario.setCodigo(codigo);
		return repository.save(usuario);
	}

	@Transactional
	public void delete(Long id) throws Exception {
		find(id);
		repository.deleteById(id);
	}
	
	public void insertPermission(Long idPermissao, Long idUsuario) {
		List<Permissao> permissoes = new ArrayList<Permissao>();
		Permissao permissao = permissaoService.find(idPermissao);
		permissoes.add(permissao);
		insertPermissions(permissoes, idUsuario);
	}
	
	public void deletePermission(Long idPermissao, Long idUsuario) throws Exception {
		Usuario usuario = find(idUsuario);
		Permissao permissao = permissaoService.find(idPermissao);
		usuario.getPermissoes().removeIf(p -> p.getId() == permissao.getId());
		repository.save(usuario);
	}
	
	public void insertPermissions(List<Permissao> permissoes, Long idUsuario) {
		Usuario usuario = find(idUsuario);
		permissoes.forEach(permissao -> {
			usuario.getPermissoes().add(permissaoService.find(permissao.getId()));
		});
		repository.save(usuario);
	}

	public Usuario copyPropertiesUsuarioFromPessoa(Pessoa entity) {
		Usuario usuario = new Usuario();
		//BeanUtils.copyProperties(entity.getUsuario(), usuario, "pessoa");
		//Pessoa pessoa = new Pessoa();
		//BeanUtils.copyProperties(entity, pessoa, "usuario");
		//usuario.setPessoa(pessoa);
		return usuario;
	}
	
	public boolean isValidUsuarioToPersist(Usuario usuario) {
		if (!ValidationMethods.isValidStringToPersist(usuario.getEmail(), 100)) {
			return false;
		}
		if (!ValidationMethods.isValidEmail(usuario.getEmail())) {
			return false;
		}
		if (!ValidationMethods.isValidTelefone(usuario.getTelefone())) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(usuario.getNome(), 60)) {
			return false;
		}
		if (!ValidationMethods.isValidStringToPersist(usuario.getSenha(), 200)) {
			return false;
		}
		if (usuario.getAtivo() == null) {
			return false;
		}
		return true;
	}

  	public List<Usuario> findByPessoa(Pessoa pessoa) {
  		return repository.findByPessoa(pessoa);
  	}
  
}
