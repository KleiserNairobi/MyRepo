package br.com.chamai.services;

import br.com.chamai.exceptions.EntidadeNaoEncontrada;
import br.com.chamai.models.*;
import br.com.chamai.models.dto.PessoaDto;
import br.com.chamai.repositories.EnderecoRepository;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.util.UtilMethods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.time.LocalDate;

@Service
public class RegistroService {

    @Autowired private PessoaRepository repository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EnderecoRepository enderecoRepository;
    @Autowired private MunicipioService municipioService;

    public Pessoa findPessoaByEmail(String email) {
        Pessoa pessoa = repository.findByEmail(email);
        if (pessoa == null) {
            throw new EntidadeNaoEncontrada("Não existe um cadastro de pessoa com o email " + email);
        }
        return pessoa;
    }

    public Pessoa findPessoaByTelefone(String telefone) {
        Pessoa pessoa = repository.findByTelefone(telefone);
        if (pessoa == null) {
            throw new EntidadeNaoEncontrada("Não existe um cadastro de pessoa com o telefone " + telefone);
        }
        return pessoa;
    }

    @Transactional
    public Pessoa insert(PessoaDto entity) {
        Municipio municipio = municipioService.findByNomeAndEstado(
                entity.getMunicipio().toUpperCase(),
                entity.getEstado().toUpperCase()
        );

        Pessoa pessoaSalva = setPessoa(entity);
        setUsuario(entity, pessoaSalva);
        setEndereco(entity, municipio, pessoaSalva);
        return pessoaSalva;
    }

    private Pessoa setPessoa(PessoaDto entity) {
        Pessoa pessoa = new Pessoa();
        pessoa.setId(null);
        pessoa.setTipo(entity.getTipoPessoa());
        pessoa.setNome(entity.getNome().toUpperCase());
        pessoa.setEmail(entity.getEmail().toLowerCase());
        pessoa.setTelefone(entity.getTelefone());
        pessoa.setCpfCnpj(entity.getCpfCnpj());
        pessoa.setRg(entity.getRg());
        pessoa.setNascimento(entity.getNascimento());
        pessoa.setParceiro(entity.getParceiro());
        pessoa.setEntregador(entity.getEntregador());
        pessoa.setCliente(entity.getCliente());
        pessoa.setColaborador(false);
        pessoa.setOnline(false);
        pessoa.setDataInclusao(LocalDate.now());
        pessoa.setDataAlteracao(null);

        if (entity.getEntregador()) {
            pessoa.setAtivo(false);
        } else {
            pessoa.setAtivo(true);
        }

        if (!StringUtils.isEmpty(entity.getNomeFantasia())) {
            pessoa.setNomeFantasia(entity.getNomeFantasia().toUpperCase());
        }
        if (!StringUtils.isEmpty(entity.getRamoAtividade())) {
            pessoa.setRamoAtividade(entity.getRamoAtividade().toUpperCase());
        }

        return repository.save(pessoa);
    }

    private void setUsuario(PessoaDto entity, Pessoa pessoaSalva) {
        Usuario usuario = new Usuario();
        usuario.setAtivo(true);
        usuario.setNome(entity.getNome().toUpperCase());
        usuario.setEmail(entity.getEmail().toLowerCase());
        usuario.setTelefone(entity.getTelefone());
        usuario.setSenha(UtilMethods.passwordEncoder(entity.getSenha()));
        usuario.setPessoa(pessoaSalva);
        usuarioRepository.save(usuario);
    }

    private void setEndereco(PessoaDto entity, Municipio municipio, Pessoa pessoaSalva) {
        Endereco endereco = new Endereco();
        endereco.setAtivo(true);
        endereco.setPessoa(pessoaSalva);
        endereco.setCep(entity.getCep());
        endereco.setLogradouro(entity.getLogradouro().toUpperCase());
        endereco.setNumero(entity.getNumero().toUpperCase());
        endereco.setComplemento(entity.getComplemento().toUpperCase());
        endereco.setBairro(entity.getBairro().toUpperCase());
        endereco.setMunicipio(municipio);
        endereco.setLatitude(entity.getLatitude());
        endereco.setLongitude(entity.getLongitude());
        endereco.setProprio(entity.getProprio());
        endereco.setTelefoneCliente(entity.getTelefone());

        if ( !StringUtils.isEmpty(entity.getReferencia()) ) {
            endereco.setReferencia(entity.getReferencia().toUpperCase());
        }
        if ( !StringUtils.isEmpty(entity.getNome()) ) {
            endereco.setNomeCliente(entity.getNome().toUpperCase());
        }

        enderecoRepository.save(endereco);
    }

}
