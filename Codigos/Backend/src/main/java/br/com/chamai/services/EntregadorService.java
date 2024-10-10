package br.com.chamai.services;

import br.com.chamai.models.Endereco;
import br.com.chamai.models.Municipio;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.models.dto.ClientePFDto;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.repositories.EnderecoRepository;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Date;

@Service
public class EntregadorService {

    @Autowired private PessoaRepository repository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EnderecoRepository enderecoRepository;
    @Autowired private EnderecoService enderecoService;
    @Autowired private UsuarioService usuarioService;
    @Autowired private MunicipioService municipioService;

    public Pessoa insert(Pessoa entity) {
        //entity.setId(null);
        //repository.save(entity);
        //usuarioRepository.save(entity.getUsuario());
        //enderecoRepository.save(entity.getEndereco());
        return entity;
    }

    public Pessoa fromDtoToEntity(ClientePFDto clientePFDto) {
        Pessoa pessoa = new Pessoa();
        Usuario usuario = new Usuario();
        Endereco endereco = new Endereco();
        Municipio municipio = municipioService.findByNomeAndEstado(
                clientePFDto.getMunicipio().toUpperCase(),
                clientePFDto.getEstado().toUpperCase()
        );

        pessoa.setTipo(TipoPessoa.F);
        pessoa.setCliente(true);
        pessoa.setEntregador(false);
        pessoa.setColaborador(false);
        pessoa.setAtivo(true);
        pessoa.setDataInclusao(LocalDate.now());
        pessoa.setDataAlteracao(null);
        pessoa.setNome(clientePFDto.getNome());
        pessoa.setEmail(clientePFDto.getEmail());
        pessoa.setTelefone(clientePFDto.getTelefone());
        pessoa.setCpfCnpj(clientePFDto.getCpfCnpj());

        usuario.setAtivo(true);
        usuario.setNome(clientePFDto.getNome());
        usuario.setEmail(clientePFDto.getEmail());
        usuario.setTelefone(clientePFDto.getTelefone());
        usuario.setSenha(clientePFDto.getSenha());
        usuario.setPessoa(pessoa);

        endereco.setAtivo(true);
        endereco.setPessoa(pessoa);
        endereco.setCep(clientePFDto.getCep());
        endereco.setLogradouro(clientePFDto.getLogradouro());
        endereco.setNumero(clientePFDto.getNumero());
        endereco.setComplemento(clientePFDto.getComplemento());
        endereco.setBairro(clientePFDto.getBairro());
        endereco.setMunicipio(municipio);
        endereco.setReferencia(clientePFDto.getReferencia());

        return pessoa;
    }
}
