package cl.mesatech.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class ClientsConfig {

    @Bean
    RestClient solicitudesClient(@Value("${services.solicitudes.url}") String url) {
        return RestClient.builder().baseUrl(url).build();
    }

    @Bean
    RestClient catalogoClient(@Value("${services.catalogo.url}") String url) {
        return RestClient.builder().baseUrl(url).build();
    }
}
