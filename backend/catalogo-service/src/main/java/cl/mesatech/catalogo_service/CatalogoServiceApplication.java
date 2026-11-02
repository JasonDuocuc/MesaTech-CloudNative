package cl.mesatech.catalogo_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CatalogoServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CatalogoServiceApplication.class, args);
    }

}