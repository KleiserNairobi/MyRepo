package br.com.chamai.services;

import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.Endereco;
import br.com.chamai.models.Municipio;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.models.dto.ClientePJDto;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.repositories.EnderecoRepository;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.util.UtilMethods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Date;

@Service
public class ClientePJService {
    @Autowired private PessoaRepository repository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EnderecoRepository enderecoRepository;
    @Autowired private EnderecoService enderecoService;
    @Autowired private UsuarioService usuarioService;
    @Autowired private MunicipioService municipioService;

    @Transactional
    public Pessoa insert(ClientePJDto entity) {
        if (repository.emailJaCadastrado(entity.getEmail())) {
            throw new ExcecaoTempoExecucao(
                    "Já existe no sistema um membro com o e-mail " + entity.getEmail()
            );
        }

        if (repository.telefoneJaCadastrado(entity.getTelefone())) {
            throw new ExcecaoTempoExecucao(
                    "Já existe no sistema um membro com o telefone " + entity.getTelefone()
            );
        }

        Date data = new Date();
        Pessoa pessoa = new Pessoa();
        pessoa.setId(null);
        pessoa.setTipo(TipoPessoa.J);
        pessoa.setNome(entity.getNome().toUpperCase());
        pessoa.setEmail(entity.getEmail().toLowerCase());
        pessoa.setTelefone(entity.getTelefone());
        pessoa.setCpfCnpj(entity.getCpfCnpj());
        pessoa.setOnline(false);
        pessoa.setDataInclusao(LocalDate.now());
        pessoa.setDataAlteracao(null);

        if (entity.getParceiro()) {
            pessoa.setParceiro(true);
            pessoa.setCliente(false);
            pessoa.setColaborador(false);
            pessoa.setEntregador(false);
            pessoa.setAtivo(true);
        } else {
            pessoa.setParceiro(false);
            pessoa.setCliente(true);
            pessoa.setColaborador(false);
            pessoa.setEntregador(false);
            pessoa.setAtivo(true);
        }

        if ( !StringUtils.isEmpty(entity.getNomeFantasia()) ) {
            pessoa.setNomeFantasia(entity.getNomeFantasia().toUpperCase());
        }
        if ( !StringUtils.isEmpty(entity.getRamoAtividade()) ) {
            pessoa.setRamoAtividade(entity.getRamoAtividade().toUpperCase());
        }
        Pessoa novaPessoa = repository.save(pessoa);

        Usuario usuario = new Usuario();
        usuario.setAtivo(true);
        usuario.setNome(entity.getNome().toUpperCase());
        usuario.setEmail(entity.getEmail().toLowerCase());
        usuario.setTelefone(entity.getTelefone());
        usuario.setSenha(UtilMethods.passwordEncoder(entity.getSenha()));
        usuario.setPessoa(novaPessoa);
        usuarioRepository.save(usuario);

        Municipio municipio = municipioService.findByNomeAndEstado(
                entity.getMunicipio().toUpperCase(),
                entity.getEstado().toUpperCase()
        );

        Endereco endereco = new Endereco();
        endereco.setAtivo(true);
        endereco.setPessoa(novaPessoa);
        endereco.setCep(entity.getCep());
        endereco.setLogradouro(entity.getLogradouro().toUpperCase());
        endereco.setNumero(entity.getNumero().toUpperCase());
        endereco.setComplemento(entity.getComplemento().toUpperCase());
        endereco.setBairro(entity.getBairro().toUpperCase());
        endereco.setMunicipio(municipio);
        endereco.setLatitude(entity.getLatitude());
        endereco.setLongitude(entity.getLongitude());
        endereco.setTelefoneCliente(entity.getTelefone());
        if ( !StringUtils.isEmpty(entity.getReferencia()) ) {
            endereco.setReferencia(entity.getReferencia().toUpperCase());
        }
        if ( !StringUtils.isEmpty(entity.getNome()) ) {
            endereco.setNomeCliente(entity.getNome().toUpperCase());
        }
        enderecoRepository.save(endereco);

        return pessoa;
    }
}
