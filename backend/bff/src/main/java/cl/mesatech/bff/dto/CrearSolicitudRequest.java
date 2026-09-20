package cl.mesatech.bff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CrearSolicitudRequest(
        @NotBlank String titulo,
        @NotBlank String descripcion,
        @NotNull Long categoriaId,
        @NotNull Long prioridadId) {}
