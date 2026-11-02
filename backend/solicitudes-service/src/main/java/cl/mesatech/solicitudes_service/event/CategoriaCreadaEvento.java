package cl.mesatech.solicitudes_service.event;

import java.time.Instant;

public record CategoriaCreadaEvento(
        String eventId,
        String tipoEvento,
        Instant fechaEvento,
        Long categoriaId,
        String nombre
) {
}