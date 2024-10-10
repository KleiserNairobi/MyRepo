package br.com.chamai.services;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import br.com.chamai.models.Aprovacao;
import br.com.chamai.models.enums.StatusAprovacao;
import br.com.chamai.repositories.AprovacaoRepository;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.repositories.filters.PessoaFilter;
import br.com.chamai.util.UtilMethods;

@Service
public class PessoaService {
	
	@Autowired private PessoaRepository repository;
	@Autowired private UsuarioService usuarioService;
	@Autowired private UsuarioRepository usuarioRepository;
	@Autowired private LocalizacaoService localizacaoService;
	@Autowired private AprovacaoRepository aprovacaoRepository;
	
	public List<Pessoa> findAll() {
		Pessoa pessoa = new UtilMethods().getPessoaFromUsuarioLogado();
		if (PessoaService.isCliente(pessoa)
				|| PessoaService.isParceiro(pessoa)
				|| PessoaService.isEntregador(pessoa)
				|| PessoaService.isParceiro(pessoa)
		) {
			return repository.findAllByPessoa(pessoa.getId());
		}
		if (PessoaService.isColaborador(pessoa)) {
			return repository.findAll();
		}
		return new ArrayList<>();
	}

	public List<Pessoa> findByClientes() {
		return repository.findByClientes();
	}

	public List<Pessoa> findByEntregadores() {
		return repository.findByEntregadores();
	}

	public List<Pessoa> findByColaboradores() {
		return repository.findByColaboradores();
	}

	public List<Pessoa> findByParceiros() {
		return repository.findByParceiros();
	}

	public Page<Pessoa> findPage(PessoaFilter filter, Pageable pageable) {
		return repository.filtrar(filter, pageable);
	}
	
	public Pessoa find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de membro com o id " + id)
		);
	}
	
	public Localizacao findLocalizacaoEntregadorDataAtual(Long id) {
		// valida se pessoa existe e se é entregador
		Pessoa pessoa = find(id);
		if (!Objects.equals(pessoa.getEntregador(), true)) {
			throw new ExcecaoTempoExecucao("Membro com o id " + id + " não é do tipo entregador.");
		}
		
		return repository.findLocalizacaoEntregadorDataAtual(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe localização na data " + UtilMethods.dataAtualFormatadaBR() + " para entregador com id " + id)
		);
	}
	
	@Transactional
	public Pessoa insert(Pessoa entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		repository.findNomeByEmail(entity.getEmail()).ifPresent((String nome) -> {
			throw new ExcecaoTempoExecucao("O email " + entity.getEmail() + " informado já está registrado no sistema para o membro " + nome);
		});
		repository.findNomeByTelefone(entity.getTelefone()).ifPresent((String nome) -> {
			throw new ExcecaoTempoExecucao("O telefone " + entity.getTelefone() + " informado já está registrado no sistema para o membro " + nome);
		});

		String senha = RandomStringUtils.randomAlphanumeric(8);

		Pessoa pessoa = new Pessoa();
		pessoa.setId(null);
		pessoa.setTipo(entity.getTipo());
		pessoa.setNome(entity.getNome().toUpperCase());
		pessoa.setEmail(entity.getEmail().toLowerCase());
		pessoa.setTelefone(entity.getTelefone());
		pessoa.setCpfCnpj(entity.getCpfCnpj());
		pessoa.setNascimento(entity.getNascimento());
		pessoa.setOnline(false);
		pessoa.setCliente(entity.getCliente());
		pessoa.setEntregador(entity.getEntregador());
		pessoa.setColaborador(entity.getColaborador());
		pessoa.setParceiro(entity.getParceiro());
		pessoa.setAtivo(entity.getEntregador() ? false : true);
		pessoa.setDataInclusao(LocalDate.now());
		pessoa.setDataAlteracao(null);
		pessoa.setRg(null);
		pessoa.setNomeFantasia(null);
		pessoa.setRamoAtividade(null);

		if ( !StringUtils.isEmpty(entity.getRg()) ) {
			pessoa.setRg(entity.getRg().toUpperCase());
		}
		if ( !StringUtils.isEmpty(entity.getNomeFantasia()) ) {
			pessoa.setNomeFantasia(entity.getNomeFantasia().toUpperCase());
		}
		if ( !StringUtils.isEmpty(entity.getRamoAtividade()) ) {
			pessoa.setRamoAtividade(entity.getRamoAtividade().toUpperCase());
		}

		Pessoa novaPessoa = repository.save(pessoa);

		Usuario usuario = new Usuario();
		usuario.setAtivo(true);
		usuario.setNome(entity.getNome().toUpperCase());
		usuario.setEmail(entity.getEmail().toLowerCase());
		usuario.setTelefone(entity.getTelefone());
		usuario.setSenha(UtilMethods.passwordEncoder(senha));
		usuario.setPessoa(novaPessoa);
		usuarioRepository.save(usuario);

		if (novaPessoa.getEntregador()) {
			Aprovacao aprovacao = new Aprovacao();
			aprovacao.setPessoa(novaPessoa);
			aprovacao.setData(LocalDate.now());
			aprovacao.setHora(Time.valueOf(LocalTime.now()));
			aprovacao.setStatusAprovacao(StatusAprovacao.P);
			aprovacaoRepository.save(aprovacao);
		}

		return novaPessoa;
	}

	@Transactional
	public Pessoa update(Pessoa entity, Long id) {

		Pessoa pessoa = find(id);
		BeanUtils.copyProperties(entity, pessoa, "id", "dataInclusao");
		pessoa.setNome(entity.getNome().toUpperCase());
		pessoa.setEmail(entity.getEmail().toLowerCase());
		pessoa.setDataAlteracao(LocalDate.now());

		if ( !StringUtils.isEmpty(entity.getRg()) ) {
			pessoa.setRg(entity.getRg().toUpperCase());
		}
		if ( !StringUtils.isEmpty(entity.getNomeFantasia()) ) {
			pessoa.setNomeFantasia(entity.getNomeFantasia().toUpperCase());
		}
		if ( !StringUtils.isEmpty(entity.getRamoAtividade()) ) {
			pessoa.setRamoAtividade(entity.getRamoAtividade().toUpperCase());
		}

		return repository.save(pessoa);
	}
	
	@Transactional
	public void updateOnline(Long id, boolean isOnline) {
		Pessoa pessoa = find(id);
		repository.updateOnline(id, isOnline);

		// Caso pessoa seja entregador, colocá-lo disponível
		if (pessoa.getEntregador().equals(true)) {
			localizacaoService.updateDisponivel(id, isOnline);
		}
	}

	@Transactional
	public void delete(Long id) {
		Pessoa pessoa = find(id);
		repository.delete(pessoa);
	}

	@Transactional
	public void ativarInativarPessoa(Long id) {
		Pessoa pessoa = find(id);
		pessoa.setAtivo( !pessoa.getAtivo() );
		repository.save(pessoa);

		List<Usuario> usuarios = usuarioService.findByPessoa(pessoa);

		for (Usuario usuario : usuarios) {
			usuario.setAtivo(!usuario.getAtivo());
		}

		usuarioRepository.saveAll(usuarios);
	}

	public static boolean isPessoaFisica(Pessoa pessoa) {
		return pessoa.getTipo() == TipoPessoa.F;
	}

	public static boolean isParceiro(Pessoa pessoa) {
		return pessoa.getParceiro() != null && pessoa.getParceiro();
	}
	
	public static boolean isColaborador(Pessoa pessoa) {
		return pessoa.getColaborador() != null && pessoa.getColaborador();
	}
	
	public static boolean isCliente(Pessoa pessoa) {
		return pessoa.getCliente() != null && pessoa.getCliente();
	}
	
	public static boolean isEntregador(Pessoa pessoa) {
		return pessoa.getEntregador() != null && pessoa.getEntregador();
	}

}
