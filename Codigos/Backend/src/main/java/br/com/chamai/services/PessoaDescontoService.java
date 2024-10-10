package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.PessoaDesconto;
import br.com.chamai.repositories.PessoaDescontoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PessoaDescontoService {

    @Autowired
    private PessoaDescontoRepository repository;

    public List<PessoaDesconto> findAll() {
        return repository.findAll();
    }

    public PessoaDesconto find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada(
                        "Não existe um cadastro de associação entre pessoa e desconto com o id " + id
                )
        );
    }

    @Transactional
    public PessoaDesconto insert(PessoaDesconto entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao(
                    "Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
            );
        }
        return repository.save(entity);
    }

    @Transactional
    public PessoaDesconto update(PessoaDesconto entity, Long id) {
        PessoaDesconto pessoaDesconto = find(id);
        BeanUtils.copyProperties(entity, pessoaDesconto, "id");
        return repository.save(pessoaDesconto);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
