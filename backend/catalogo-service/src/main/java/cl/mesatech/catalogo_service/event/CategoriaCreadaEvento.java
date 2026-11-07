package cl.mesatech.catalogo_service.event;

import java.time.Instant;
import java.util.UUID;

public record CategoriaCreadaEvento(
        String eventId,
        String tipoEvento,
        Instant fechaEvento,
        Long categoriaId,
        String nombre) {

    public static CategoriaCreadaEvento crear(
            Long categoriaId,
            String nombre) {

        return new CategoriaCreadaEvento(
                UUID.randomUUID().toString(),
                "CATEGORIA_CREADA",
                Instant.now(),
                categoriaId,
                nombre);
    }
}