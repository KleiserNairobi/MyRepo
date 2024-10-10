package br.com.chamai.configs.squiggly;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.web.RequestSquigglyContextProvider;
import com.github.bohnman.squiggly.web.SquigglyRequestFilter;
//import java.util.Arrays;

@Configuration
public class SquigglyConfig {

    @Bean
    public FilterRegistrationBean<SquigglyRequestFilter> squigglyRequestFilterFilter(ObjectMapper objectmapper)  {
        Squiggly.init(objectmapper, new RequestSquigglyContextProvider("campos", null ));

        // Caso queira especificar filtro em apenas alguns endpoints, proceda assim
        //var urlPatterns = Arrays.asList("/pessoas/*", "/usuarios/*");

        var filterRegistration = new FilterRegistrationBean<SquigglyRequestFilter>();
        filterRegistration.setFilter(new SquigglyRequestFilter());
        filterRegistration.setOrder(1);
        //filterRegistration.setUrlPatterns(urlPatterns);

        return filterRegistration;
    }
}
