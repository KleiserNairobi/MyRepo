package br.com.chamai.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Cartao;
import br.com.chamai.repositories.CartaoRepository;
import br.com.chamai.util.EncriptaDecriptaAES;

@Service
public class CartaoService {

	@Autowired CartaoRepository repository;
	
	public List<Cartao> findAll() {
		return repository.findAll().stream().map(cartao -> {
			decryptCartao(cartao);
			return cartao;
		}).collect(Collectors.toList());
	}
	
	public Cartao find(Long id) {
		Optional<Cartao> optional = repository.findById(id);
		if (!optional.isPresent()) {
			throw new EntidadeNaoEncontrada("Não existe um cadastro de cartão com o id " + id);
		}
		Cartao cartao = optional.get();
		decryptCartao(cartao);
		return cartao;
	}

	@Transactional
	public Cartao insert(Cartao entity) {
		if (entity.getId() != null) {
			throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
		}
		encryptCartao(entity);
		return repository.save(entity);
	}

	@Transactional
	public Cartao update(Cartao entity, Long id) {
		Cartao cartao = find(id);
		BeanUtils.copyProperties(entity, cartao, "id");
		encryptCartao(cartao);
		return repository.save(cartao);
	}

	@Transactional
	public void delete(Long id) {
		find(id);
		repository.deleteById(id);
	}


	private void encryptCartao(Cartao entity) {
		try {
			entity.setNumeroCartao(EncriptaDecriptaAES.encrypt(entity.getNumero()));
			entity.setValidadeCartao(EncriptaDecriptaAES.encrypt(entity.getValidade()));
			entity.setNomeCartao(EncriptaDecriptaAES.encrypt(entity.getNome()));
			entity.setCwCartao(EncriptaDecriptaAES.encrypt(entity.getCw()));
			entity.setAtivoCartao(EncriptaDecriptaAES.encrypt(entity.getAtivo().toString()));
		} catch (Exception e) {
			throw new ExcecaoTempoExecucao("Erro ao criptografar dados.");
		}
	}

	private void decryptCartao(Cartao cartao) {
		try {
			if (!StringUtils.isEmpty(cartao.getNumeroCartao())) {
				cartao.setNumero(EncriptaDecriptaAES.decrypt(cartao.getNumeroCartao()));
			}
			if (!StringUtils.isEmpty(cartao.getValidadeCartao())) {
				cartao.setValidade(EncriptaDecriptaAES.decrypt(cartao.getValidadeCartao()));
			}
			if (!StringUtils.isEmpty(cartao.getNomeCartao())) {
				cartao.setNome(EncriptaDecriptaAES.decrypt(cartao.getNomeCartao()));
			}
			if (!StringUtils.isEmpty(cartao.getCwCartao())) {
				cartao.setCw(EncriptaDecriptaAES.decrypt(cartao.getCwCartao()));
			}
			if (!StringUtils.isEmpty(cartao.getAtivoCartao())) {
				String ativo = EncriptaDecriptaAES.decrypt(cartao.getAtivoCartao());
				cartao.setAtivo(!StringUtils.isEmpty(ativo) && ativo.equalsIgnoreCase("true"));
			}
		} catch (Exception e) {
			throw new ExcecaoTempoExecucao("Erro ao descriptografar dados.");
		}
	}
	
}
