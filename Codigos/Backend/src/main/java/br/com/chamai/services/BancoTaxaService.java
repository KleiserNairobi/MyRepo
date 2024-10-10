package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.BancoTaxa;
import br.com.chamai.repositories.BancoTaxaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;

@Service
public class BancoTaxaService {

    @Autowired
    private BancoTaxaRepository repository;

    public List<BancoTaxa> findAll() {
        return repository.findAll();
    }

    public BancoTaxa find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de taxa bancária com o id " + id)
        );
    }

    @Transactional
    public BancoTaxa insert(BancoTaxa entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
        }
        return repository.save(entity);
    }

    @Transactional
    public BancoTaxa update(BancoTaxa entity, Long id) {
        BancoTaxa bancoTaxa = find(id);
        BeanUtils.copyProperties(entity, bancoTaxa, "id");
        return repository.save(bancoTaxa);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
