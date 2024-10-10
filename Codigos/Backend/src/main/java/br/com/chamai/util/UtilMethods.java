package br.com.chamai.util;

import java.beans.PropertyDescriptor;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.util.StringUtils;

import br.com.chamai.configs.ApplicationContextHolder;
import br.com.chamai.configs.security.UsuarioSistema;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.repositories.UsuarioRepository;

public class UtilMethods {
	
	ApplicationContext instance = ApplicationContextHolder.getInstance();
	UsuarioRepository usuarioRepository = instance.getBean(UsuarioRepository.class);

	public static String[] getNullPropertyNames(Object source) {
		final BeanWrapper src = new BeanWrapperImpl(source);
		PropertyDescriptor[] pds = src.getPropertyDescriptors();

		Set<String> emptyNames = new HashSet<String>();
		for (java.beans.PropertyDescriptor pd : pds) {
			Object srcValue = src.getPropertyValue(pd.getName());
			if (srcValue == null)
				emptyNames.add(pd.getName());
		}

		String[] result = new String[emptyNames.size()];
		return emptyNames.toArray(result);
	}

	public static String passwordEncoder(String password) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder.encode(password);
	}

	public static Date asDate(LocalDate localDate) {
		return Date.from(
				localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()
		);
	}

	public static Date asDate(LocalDateTime localDateTime) {
		return Date.from(
				localDateTime.atZone(ZoneId.systemDefault()).toInstant()
		);
	}

	public static LocalDate asLocalDate(Date date) {
		return Instant.ofEpochMilli(date.getTime())
				.atZone(ZoneId.systemDefault())
				.toLocalDate();
	}

	public static LocalDateTime asLocalDateTime(Date date) {
		return Instant.ofEpochMilli(date.getTime())
				.atZone(ZoneId.systemDefault())
				.toLocalDateTime();
	}

	/**
	 * Método para retornar endereço para enviar requisição aos serviços do Google Maps
	 * 
	 * @param logradouro
	 * @param numero
	 * @param bairro
	 * @param cidade
	 * @param estado
	 * @return
	 */
	public static String tratarEnderecoParaGoogleMaps(
			String logradouro,
			String numero,
			String bairro,
			String cidade,
			String estado) {

		if (StringUtils.isEmpty(logradouro)) {
			throw new ExcecaoTempoExecucao("Logradouro não foi informado.");
		}
		
		if (!StringUtils.isEmpty(numero)) {
			logradouro += ", " + numero;
		}
		
		if (StringUtils.isEmpty(bairro)) {
			throw new ExcecaoTempoExecucao("Bairro não foi informado.");
		}
		logradouro += ", " + bairro;
		
		if (StringUtils.isEmpty(cidade)) {
			throw new ExcecaoTempoExecucao("Cidade não foi informada.");
		}
		logradouro += ", " + cidade;
		
		if (StringUtils.isEmpty(estado)) {
			throw new ExcecaoTempoExecucao("Estado não foi informado.");
		}
		logradouro += " - " + estado;

		return logradouro;
	}
	
	/**
	 * Método para retornar data atual no formato dia/mês/ano
	 * 
	 * @return
	 */
	public static String dataAtualFormatadaBR() {
		LocalDate data = LocalDate.now();
		DateTimeFormatter formatterData = DateTimeFormatter.ofPattern("dd/MM/uuuu");
		return formatterData.format(data);
	}
	
	public Optional<Usuario> getUsuarioLogado() {
		if (SecurityContextHolder.getContext().getAuthentication() instanceof OAuth2Authentication) { // para autenticação oauth2
			OAuth2Authentication authentication = (OAuth2Authentication) SecurityContextHolder.getContext().getAuthentication();
			String login = (String) authentication.getPrincipal();
			Optional<Usuario> optional = usuarioRepository.findByLogin(login);
			if (!optional.isPresent() || optional.get().getAtivo() == null || optional.get().getAtivo() == false) {
				throw new ExcecaoTempoExecucao("Usuário não encontrado ou inativo");
			}
			return optional;
		}
		UsuarioSistema user = (UsuarioSistema) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (user != null && user.getUsuario() != null) {
			return Optional.of(user.getUsuario());
		}
		return Optional.of(null);
	}
	
	public Pessoa getPessoaFromUsuarioLogado() {
		return getUsuarioLogado().map(obj -> obj.getPessoa())
				.orElseThrow(() -> new ExcecaoTempoExecucao("Pessoa não localizada no usuário logado"));
	}

	public static int toInteger(Integer id) {
		if (id == null) {
			return 0;
		}
		return Integer.parseInt(id.toString());
	}
	
	public static long toLong(Long id) {
		if (id == null) {
			return 0;
		}
		return Long.parseLong(id.toString());
	}
	
	public static long toLong(Integer id) {
		if (id == null) {
			return 0;
		}
		return Long.parseLong(id.toString());
	}

}
