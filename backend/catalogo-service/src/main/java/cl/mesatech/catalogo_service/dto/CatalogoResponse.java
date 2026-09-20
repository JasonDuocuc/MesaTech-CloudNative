package cl.mesatech.catalogo_service.dto;

import java.util.List;

public record CatalogoResponse(
        List<CategoriaResponse> categorias,
        List<PrioridadResponse> prioridades
) {
}