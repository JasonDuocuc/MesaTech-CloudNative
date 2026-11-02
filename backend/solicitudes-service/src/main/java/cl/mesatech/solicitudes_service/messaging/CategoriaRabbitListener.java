package cl.mesatech.solicitudes_service.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import cl.mesatech.solicitudes_service.event.CategoriaCreadaEvento;
import cl.mesatech.solicitudes_service.service.CategoriaEventoService;

@Component
public class CategoriaRabbitListener {

    private static final Logger log =
            LoggerFactory.getLogger(CategoriaRabbitListener.class);

    private final CategoriaEventoService categoriaEventoService;

    public CategoriaRabbitListener(
            CategoriaEventoService categoriaEventoService) {

        this.categoriaEventoService = categoriaEventoService;
    }

    @RabbitListener(queues = "mesatech.solicitudes.categorias")
    public void recibirCategoriaCreada(CategoriaCreadaEvento evento) {

        log.info(
                "Evento recibido desde RabbitMQ: {}",
                evento.eventId());

        categoriaEventoService.procesar(evento);

        log.info(
                "Procesamiento finalizado para el evento {}",
                evento.eventId());
    }
}