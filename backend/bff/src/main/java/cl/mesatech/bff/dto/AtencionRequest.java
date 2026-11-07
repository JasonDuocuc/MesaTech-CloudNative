package cl.mesatech.bff.dto;

import jakarta.validation.constraints.NotBlank;

public record AtencionRequest(@NotBlank String detalle) {}
