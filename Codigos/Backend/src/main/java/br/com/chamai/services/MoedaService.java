package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Moeda;
import br.com.chamai.repositories.MoedaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;

@Service
public class MoedaService {

    @Autowired
    private MoedaRepository repository;

    public List<Moeda> findAll() {
        return repository.findAll();
    }

    public Moeda find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de moeda com o id " + id)
        );
    }

    @Transactional
    public Moeda insert(Moeda entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
        }
        entity.setDescricao(entity.getDescricao().toUpperCase());
        return repository.save(entity);
    }

    @Transactional
    public Moeda update(Moeda entity, Long id) {
        Moeda moeda = find(id);
        moeda.setDescricao(entity.getDescricao().toUpperCase());
        return repository.save(moeda);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
