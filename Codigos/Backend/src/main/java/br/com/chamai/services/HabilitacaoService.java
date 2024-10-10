package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Habilitacao;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Veiculo;
import br.com.chamai.repositories.HabilitacaoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class HabilitacaoService {

    @Autowired private HabilitacaoRepository repository;
    @Autowired private PessoaService pessoaService;

    public List<Habilitacao> findAll() {
        return repository.findAll();
    }

    public Habilitacao find(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new EntidadeNaoEncontrada("Não existe um cadastro de habilitação com o id " + id)
        );
    }

    public Optional<Habilitacao> findByPessoa(Long idPessoa) {
        Pessoa pessoa = pessoaService.find(idPessoa);
        return repository.findByPessoa(pessoa);
    }

    @Transactional
    public Habilitacao insert(Habilitacao entity) {
        if (entity.getId() != null) {
            throw new ExcecaoTempoExecucao(
                    "Operação de inserção com atributo ID. Verifique se o intuito era atualizar."
            );
        }
        entity.setRegistro(entity.getRegistro().toUpperCase());
        entity.setCategoria(entity.getCategoria().toUpperCase());
        entity.setLocalExpedicao(entity.getLocalExpedicao().toUpperCase());
        return repository.save(entity);
    }

    @Transactional
    public Habilitacao update(Habilitacao entity, Long id) {
        Habilitacao habilitacao = find(id);
        BeanUtils.copyProperties(entity, habilitacao, "id");
        habilitacao.setRegistro(entity.getRegistro().toUpperCase());
        habilitacao.setCategoria(entity.getCategoria().toUpperCase());
        habilitacao.setLocalExpedicao(entity.getLocalExpedicao().toUpperCase());
        return repository.save(habilitacao);
    }

    @Transactional
    public void delete(Long id) {
        find(id);
        repository.deleteById(id);
    }

}
