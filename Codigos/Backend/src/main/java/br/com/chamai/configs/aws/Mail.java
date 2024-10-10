package br.com.chamai.configs.aws;

import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.util.Properties;

public class Mail implements EnvioEmailService {

    static final int    PORT          = 587;
    static final String FROM          = "contato@chamai.com.br";
    static final String FROMNAME      = "Contato Chamaí";
    static final String SMTP_USERNAME = "AKIAXDE75HPWHURSLRUM";
    static final String SMTP_PASSWORD = "BHYJ7jbPDURmpnyXqIi2V/sFiJ3LwXETeMWglGUOSeco";
    static final String HOST          = "email-smtp.us-east-1.amazonaws.com";
    static final String PATH_TEMPLATE = "src/main/resources/templates";

    @Autowired private JavaMailSender javaMailSender;
    private Configuration config = new Configuration(Configuration.VERSION_2_3_0);

    @Override
    public void enviar(Mensagem mensagem) {

        Properties props = System.getProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.port", PORT);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");

        try {
            String corpo = processarTemplate(mensagem);
            Session session = Session.getDefaultInstance(props);
            MimeMessage msg = new MimeMessage(session);
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setFrom(new InternetAddress(FROM, FROMNAME));
            helper.setTo(mensagem.getDestinatarios().toArray(new String[0]));
            helper.setSubject(mensagem.getAssunto());
            helper.setText(corpo, true);

            Transport transport = session.getTransport();
            try {
                transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
                transport.sendMessage(msg, msg.getAllRecipients());
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            } finally {
                transport.close();
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private String processarTemplate(Mensagem mensagem) {
        try {
            config.setDirectoryForTemplateLoading(new File(PATH_TEMPLATE));
            Template template = config.getTemplate(mensagem.getCorpo());
            return FreeMarkerTemplateUtils.processTemplateIntoString(template, mensagem.getVariaveis());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
