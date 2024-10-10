package br.com.chamai.resources;

import br.com.chamai.models.Usuario;
import br.com.chamai.services.UsuarioService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.internet.MimeMessage;

@RestController
@RequestMapping("/emails")
@Api(value = "Envio de email")
public class EmailResource {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/{email}/recuperar-senha")
    @ApiOperation(value = "Envia email contendo instruções para recuperar a senha")
    public String sendMailRecuperarSenha(@PathVariable String email) {
        Usuario usuario = usuarioService.findByEmail(email);
        String codigo = RandomStringUtils.randomAlphanumeric(8).toUpperCase();
        usuarioService.updateCodigo(usuario, codigo);

        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper( mail );
            helper.setFrom("app.chamaih@gmail.com");
            helper.setTo(usuario.getEmail());
            helper.setSubject("Esqueceu a senha");
            helper.setText(
                    "<p>Caro(a) " + usuario.getNome() + ",</p>" +
                    "<br/>" +
                    "<p>Você solicitou a recuperação de sua senha de acesso aos sistemas da Chamaih!</p>" +
                    "<p>Clique no link para cadastrar a nova senha: " +
                    "<a href='https://chamai.com.br/trocar-senha'>Recuperar minha senha</a>" +
                    "<p>Na tela que se abrirá, informe o código de recuperação <b>" + codigo +
                    "</b>&nbsp; e os demais campos solicitados.</p>" +
                    "<br/><p>Caso seu cliente de email não permita clicar no link acima, </p>" +
                    "<p>copie e cole o endereço abaixo no seu navegador de internet:</p>" +
                    "<p>https://chamai.com.br/trocar-senha</p>" +
                    "<br/><p>--</p>" +
                    "<p>Favor não responder à este email. Esta é uma mensagem automática.</p>" +
                    "<p>Chamaih Coletas e Entregas.</p>",
                    true
            );
            mailSender.send(mail);
            return "Email enviado com sucesso!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao enviar e-mail";
        }
    }

}
