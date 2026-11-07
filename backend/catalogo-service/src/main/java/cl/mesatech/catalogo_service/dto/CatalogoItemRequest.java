package cl.mesatech.catalogo_service.dto;

import jakarta.validation.constraints.NotBlank;

public record CatalogoItemRequest(
        @NotBlank String nombre
) {
}