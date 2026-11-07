package cl.mesatech.solicitudes_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.mesatech.solicitudes_service.entity.CategoriaLocal;
import cl.mesatech.solicitudes_service.event.CategoriaCreadaEvento;
import cl.mesatech.solicitudes_service.repository.CategoriaLocalRepository;

@Service
public class CategoriaEventoService {

    private static final Logger log =
            LoggerFactory.getLogger(CategoriaEventoService.class);

    private final CategoriaLocalRepository categoriaLocalRepository;

    public CategoriaEventoService(
            CategoriaLocalRepository categoriaLocalRepository) {

        this.categoriaLocalRepository = categoriaLocalRepository;
    }

    @Transactional
    public void procesar(CategoriaCreadaEvento evento) {

        if (evento == null
                || evento.eventId() == null
                || evento.eventId().isBlank()
                || evento.categoriaId() == null
                || evento.nombre() == null
                || evento.nombre().isBlank()
                || !"CATEGORIA_CREADA".equals(evento.tipoEvento())) {

            throw new IllegalArgumentException(
                    "Evento de categoría inválido");
        }

        if (categoriaLocalRepository.existsByEventId(evento.eventId())) {

            log.info(
                    "Evento {} ya procesado. Se omite.",
                    evento.eventId());

            return;
        }

        if (categoriaLocalRepository.existsById(evento.categoriaId())) {

            throw new IllegalStateException(
                    "La categoría ya existe con otro eventId: "
                            + evento.categoriaId());
        }

        CategoriaLocal categoria = new CategoriaLocal(
                evento.categoriaId(),
                evento.nombre(),
                evento.eventId());

        categoriaLocalRepository.saveAndFlush(categoria);

        log.info(
                "Categoría {} registrada desde RabbitMQ. Evento: {}",
                evento.categoriaId(),
                evento.eventId());
    }
}