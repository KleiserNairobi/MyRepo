package br.com.chamai.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.Parametro;
import br.com.chamai.models.enums.TipoVeiculo;
import br.com.chamai.repositories.ParametroRepository;

@Service
public class ParametroService {

    @Autowired
    private ParametroRepository repository;

    public List<Parametro> findAll() {
        return repository.findAll();
    }

    public Parametro find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de parâmetro com o id " + id)
        );
    }
    
    public Optional<BigDecimal> findDistanciaByTipoVeiculo(TipoVeiculo tipoVeiculo, long id) {
    	switch (tipoVeiculo) {
				case C:
					return repository.findDistanciaCarroById(id);
				case M:
					return repository.findDistanciaMotoById(id);
				case B:
					return repository.findDistanciaBikeById(id);
				case CM:
					return repository.findDistanciaCaminhaoById(id);
				default:
					throw new IllegalArgumentException("Tipo de veículo (" + tipoVeiculo +") não parametrizado");
			}
    }

    @Transactional
    public Parametro update(Parametro entity, Long id) {
        Parametro parametro = find(id);
        BeanUtils.copyProperties(entity, parametro, "id");
        return repository.save(parametro);
    }

}
