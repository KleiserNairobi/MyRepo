package br.com.chamai.configs.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;


@Configuration
@EnableAuthorizationServer
@Profile("oauth-security")
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

	@Autowired private AuthenticationManager authenticationManager;
	
	@Autowired private UserDetailsService userDetailsService;
	
	@Override
	public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
		clients.inMemory()
						.withClient("app-chamai-web")
						.secret("$2a$10$nQKdKecactl44ZcHZ8gxteG0bYHYiNHBoN11DwLAoAy1q44PCnYYy")
						.scopes("read", "write")
						.authorizedGrantTypes("password")
						.accessTokenValiditySeconds(3600 * 24)
						.and()
						.withClient("app-chamai-mobile")
						.secret("$2a$10$nQKdKecactl44ZcHZ8gxteG0bYHYiNHBoN11DwLAoAy1q44PCnYYy")
						.scopes("read")
						.authorizedGrantTypes("password")
						.accessTokenValiditySeconds((3600 * 24) * 30);
		
		super.configure(clients);
	}
	
	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
		TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
		tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));
		
		endpoints
		.tokenStore(tokenStore())
		.tokenEnhancer(tokenEnhancerChain)
		.reuseRefreshTokens(false)
    	.userDetailsService(userDetailsService)
		.authenticationManager(authenticationManager);
		
		super.configure(endpoints);
	}

	@Bean
	public JwtAccessTokenConverter accessTokenConverter() {
		JwtAccessTokenConverter accessTokenConverter = new JwtAccessTokenConverter();
		accessTokenConverter.setSigningKey("chamai");
		return accessTokenConverter;
	}

	private TokenStore tokenStore() {
		return new JwtTokenStore(accessTokenConverter());
	}
	
	@Bean
	public TokenEnhancer tokenEnhancer() {
		return new CustomTokenEnhancer();
	}
	 
}