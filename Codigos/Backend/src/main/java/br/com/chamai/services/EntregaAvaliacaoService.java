package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.EntregaAvaliacao;
import br.com.chamai.repositories.EntregaAvaliacaoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EntregaAvaliacaoService {

    @Autowired
    EntregaAvaliacaoRepository repository;

    public List<EntregaAvaliacao> findAll() {
        return repository.findAll();
    }

    public EntregaAvaliacao find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de avaliação com o id " + id)
        );
    }

    @Transactional
    public EntregaAvaliacao insert(EntregaAvaliacao entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao(
                    "Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
            );
        }
        return repository.save(entity);
    }

    @Transactional
    public EntregaAvaliacao update(EntregaAvaliacao entity, Long id) {
        EntregaAvaliacao avaliacao = find(id);
        BeanUtils.copyProperties(entity, avaliacao, "id");
        return repository.save(avaliacao);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
