package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.PessoaMovimento;
import br.com.chamai.repositories.PessoaMovimentoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;

@Service
public class PessoaMovimentoService {

    @Autowired
    private PessoaMovimentoRepository repository;

    public List<PessoaMovimento> findAll() {
        return repository.findAll();
    }

    public PessoaMovimento find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de movimentação de pessoa com o id " + id)
        );
    }

    @Transactional
    public PessoaMovimento insert(PessoaMovimento entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao("Operação de inserção com atributo ID. Verifique se o intuito era atualizar.");
        }
        return repository.save(entity);
    }

    @Transactional
    public PessoaMovimento update(PessoaMovimento entity, Long id) {
        PessoaMovimento pessoaMovimento = find(id);
        BeanUtils.copyProperties(entity, pessoaMovimento, "id");
        return repository.save(pessoaMovimento);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
