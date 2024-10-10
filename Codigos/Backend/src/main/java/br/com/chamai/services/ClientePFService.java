package br.com.chamai.services;

import br.com.chamai.exceptions.ExcecaoTempoExecucao;
import br.com.chamai.models.*;
import br.com.chamai.models.dto.ClientePFDto;
import br.com.chamai.models.enums.StatusAprovacao;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.repositories.AprovacaoRepository;
import br.com.chamai.repositories.EnderecoRepository;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.util.UtilMethods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Service
public class ClientePFService {

    @Autowired private PessoaRepository repository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EnderecoRepository enderecoRepository;
    @Autowired private EnderecoService enderecoService;
    @Autowired private UsuarioService usuarioService;
    @Autowired private MunicipioService municipioService;
    @Autowired private AprovacaoRepository aprovacaoRepository;

//    private AWSMail envioEmailService = new AWSMail();

    @Transactional
    public Pessoa insert(ClientePFDto entity) {
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

        Pessoa pessoa = new Pessoa();
        pessoa.setId(null);
        pessoa.setTipo(TipoPessoa.F);
        pessoa.setOnline(false);
        pessoa.setDataInclusao(LocalDate.now());
        pessoa.setDataAlteracao(null);
        pessoa.setNome(entity.getNome().toUpperCase());
        pessoa.setEmail(entity.getEmail().toLowerCase());
        pessoa.setTelefone(entity.getTelefone());
        pessoa.setCpfCnpj(entity.getCpfCnpj());

        if (entity.getParceiro()) {
            pessoa.setParceiro(true);
            pessoa.setCliente(false);
            pessoa.setColaborador(false);
            pessoa.setEntregador(false);
            pessoa.setAtivo(true);
        }

        if (entity.getEntregador()) {
            pessoa.setParceiro(false);
            pessoa.setCliente(false);
            pessoa.setColaborador(false);
            pessoa.setEntregador(true);
            pessoa.setAtivo(false);
        }

        if (!entity.getParceiro() && !entity.getEntregador()) {
            pessoa.setParceiro(false);
            pessoa.setCliente(true);
            pessoa.setColaborador(false);
            pessoa.setEntregador(false);
            pessoa.setAtivo(true);
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

        if (entity.getProprio()) {
            endereco.setProprio(entity.getProprio());
        } else {
            endereco.setProprio(true);
        }

        if ( !StringUtils.isEmpty(entity.getNome()) ) {
            endereco.setNomeCliente(entity.getNome().toUpperCase());
        }

        if ( !StringUtils.isEmpty(entity.getReferencia()) ) {
            endereco.setReferencia(entity.getReferencia().toUpperCase());
        }
        enderecoRepository.save(endereco);

        if (novaPessoa.getEntregador()) {
            Aprovacao aprovacao = new Aprovacao();
            aprovacao.setPessoa(novaPessoa);
            aprovacao.setData(LocalDate.now());
            aprovacao.setHora(Time.valueOf(LocalTime.now()));
            aprovacao.setStatusAprovacao(StatusAprovacao.P);
            aprovacaoRepository.save(aprovacao);
        }



//        Mensagem mensagem = Mensagem.builder()
//                .assunto("Boas Vindas")
//                .corpo("boasvindas-geral.html")
//                .variavel("usuario", usuario)
//                .destinatario(novaPessoa.getEmail())
//                .build();
//
//        envioEmailService.enviar(mensagem);

        return pessoa;
    }
}

