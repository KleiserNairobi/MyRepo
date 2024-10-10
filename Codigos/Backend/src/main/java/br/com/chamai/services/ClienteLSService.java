package br.com.chamai.services;

//import br.com.chamai.configs.aws.AWSMail;
//import br.com.chamai.configs.aws.EnvioEmailService;
import br.com.chamai.models.Pessoa;
import br.com.chamai.models.Usuario;
import br.com.chamai.models.dto.ClienteLSDto;
import br.com.chamai.models.enums.TipoPessoa;
import br.com.chamai.repositories.PermissaoRepository;
import br.com.chamai.repositories.PessoaRepository;
import br.com.chamai.repositories.UsuarioRepository;
import br.com.chamai.util.UtilMethods;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import static br.com.chamai.util.EncriptaDecriptaAES.encryptToString;

@Service
public class ClienteLSService {

    @Autowired private PessoaRepository repository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PermissaoRepository permissaoRepository;
    @Autowired private PermissaoService permissaoService;

//    private AWSMail envioEmailService = new AWSMail();

    @Transactional
    public Pessoa insert(ClienteLSDto entity) {
        if (repository.emailJaCadastrado(entity.getEmail())) {
            Pessoa pessoa = repository.findByEmail(entity.getEmail());
            return pessoa;
        } else {
            String senha = RandomStringUtils.randomAlphanumeric(8);

            Pessoa pessoa = new Pessoa();
            pessoa.setTipo(TipoPessoa.F);
            pessoa.setOnline(false);
            pessoa.setCliente(true);
            pessoa.setEntregador(false);
            pessoa.setColaborador(false);
            pessoa.setParceiro(false);
            pessoa.setAtivo(true);
            pessoa.setNome(entity.getNome().toUpperCase());
            pessoa.setEmail(entity.getEmail().toLowerCase());
            pessoa.setTelefone(null);
            pessoa.setCpfCnpj(null);
            pessoa.setNomeFantasia(null);
            pessoa.setRamoAtividade(null);
            pessoa.setDataInclusao(LocalDate.now());
            pessoa.setDataAlteracao(null);
            pessoa.setSenhaSocial( encryptToString(senha) );

            Pessoa novaPessoa = repository.save(pessoa);

            //Permissao permissao = new Permissao();
            //permissao = permissaoService.find(1L);
            //List<Permissao> listaPermissoes = new ArrayList<Permissao>();
            //listaPermissoes.add(permissao);

            Usuario usuario = new Usuario();
            usuario.setNome(pessoa.getNome());
            usuario.setEmail(pessoa.getEmail());
            usuario.setTelefone(null);
            usuario.setSenha( UtilMethods.passwordEncoder(senha) );
            usuario.setSenhaSocial( encryptToString(senha) );
            usuario.setAtivo(true);
            usuario.setPessoa(pessoa);
            //usuario.setPermissoes(null);
            usuarioRepository.save(usuario);

            // O email deverá informar ao usuário a sua senha
//            EnvioEmailService.Mensagem mensagem = EnvioEmailService.Mensagem.builder()
//                    .assunto("Boas Vindas")
//                    .corpo("boasvindas-geral.html")
//                    .variavel("usuario", usuario)
//                    .destinatario(entity.getEmail())
//                    .build();
//            envioEmailService.enviar(mensagem);


            return novaPessoa;
        }
    }

}
