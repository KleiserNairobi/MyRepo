package br.com.chamai.services;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Localizacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.enums.TipoVeiculo;
import br.com.chamai.repositories.LocalizacaoRepository;
import br.com.chamai.repositories.PessoaRepository;

@Service
public class LocalizacaoService {
	
	@Autowired private LocalizacaoRepository repository;
	@Autowired private PessoaRepository pessoaRepository;
	@Autowired private PessoaService pessoaService;
	@Autowired private ParametroService parametroService;
	
	public List<Localizacao> findAll() {
		return repository.findAll();
	}
	
	public Pessoa findEntregador(Long id) {
		Localizacao localizacao = find(id);
		Pessoa pessoa = localizacao.getPessoa();
		if (!Objects.equals(pessoa.getEntregador(), true)) {
			throw new ExcecaoTempoExecucao("Membro com id " + pessoa.getId() + " não é do tipo entregador.");
		}
		return pessoa;
	}
	
	public Localizacao find(Long id) {
		return repository.findById(id).orElseThrow(
				() -> new EntidadeNaoEncontrada("Não existe um cadastro de localização com o id " + id)
		);
	}
	
	public Optional<Localizacao> findByEntregador(Long id) {
		return repository.findByEntregador(id);
	}
	
	public Optional<Localizacao> localizacaoEntregadorDisponivel(Long id) {
		if (id == null) {
			throw new ExcecaoTempoExecucao("Id não pode ser nulo");
		}
		return repository.localizacaoEntregadorDisponivel(id);
	}
	
	public List<Localizacao> listEntregadoresByLatitudeLongitude(BigDecimal lat, BigDecimal lng, TipoVeiculo tipo) {
		return repository.listEntregadoresByLatitudeLongitude(lat, lng, tipo.name(), getDistanciaMaximaByTipoVeiculo(tipo));
	}
	
	private BigDecimal getDistanciaMaximaByTipoVeiculo(TipoVeiculo tipo) {
		BigDecimal distanciaMaxima = parametroService.findDistanciaByTipoVeiculo(tipo, 1l)
				.orElseThrow(() -> new EntidadeNaoEncontrada("Parâmetro da distância para tipo de veículo " + tipo + " não localizado."));
		if (distanciaMaxima.doubleValue() <= 0.0) {
			throw new ExcecaoTempoExecucao("Parâmetro da distância para tipo de veículo " + tipo + " não pode ser menor ou igual a zero.");
		}
		return distanciaMaxima;
	}

	@Transactional
	public Localizacao insert(Localizacao entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao(
					"Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
			);
		}
		if (entity.getPessoa() == null || entity.getPessoa().getId() == null) {
			throw new EntidadeNaoEncontrada("Pessoa não informada");
		}
		pessoaRepository.findById(entity.getPessoa().getId());
		return repository.save(entity);
	}
	
	@Transactional
	public Localizacao insertEntregador(Localizacao entity) {
		if (entity.getPessoa().getId() == null) {
			throw new EntidadeNaoEncontrada("Id da pessoa não foi informado");
		}
		
		Pessoa pessoa = pessoaService.find(entity.getPessoa().getId());
		if (!Objects.equals(pessoa.getEntregador(), true)) {
			throw new ExcecaoTempoExecucao("Membro com id " + pessoa.getId() + " não é do tipo entregador.");
		}
		
		Optional<Localizacao> optional = repository.findByEntregador(pessoa.getId());

		if (optional.isPresent()) {
			// Existindo o registro, não devo atualizar o campo disponível
			Localizacao localizacao = optional.get();
			localizacao.setData(LocalDate.now());
			localizacao.setHora(new Time(System.currentTimeMillis()));
			localizacao.setLatitude(entity.getLatitude());
			localizacao.setLongitude(entity.getLongitude());
			return repository.save(localizacao);
		} else {
			// Não existindo o registro, informo todos os campos e digo que o entregador está disponível
			Localizacao localizacao = new Localizacao();
			localizacao.setPessoa(entity.getPessoa());
			localizacao.setData(LocalDate.now());
			localizacao.setHora(new Time(System.currentTimeMillis()));
			localizacao.setLatitude(entity.getLatitude());
			localizacao.setLongitude(entity.getLongitude());
			localizacao.setDisponivel(true);
			return repository.save(localizacao);
		}
	}

	@Transactional
	public void updateDisponivel(Long idPessoa, boolean isDisponivel) {
		Optional<Localizacao> localizacaoEntregador = findByEntregador(idPessoa);
		if (localizacaoEntregador.isPresent()) {
			Localizacao localizacao = new Localizacao();
			localizacao.setId(localizacaoEntregador.get().getId());
			localizacao.setPessoa( localizacaoEntregador.get().getPessoa() );
			localizacao.setData(LocalDate.now());
			localizacao.setHora(new Time(System.currentTimeMillis()));
			localizacao.setLongitude(localizacaoEntregador.get().getLongitude());
			localizacao.setLatitude(localizacaoEntregador.get().getLatitude());
			localizacao.setDisponivel(isDisponivel);
			repository.save(localizacao);
		}
	}

}
