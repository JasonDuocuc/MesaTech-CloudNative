package cl.mesatech.bff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CambiarEstadoRequest(
                @NotBlank @Pattern(regexp = "CREADA|ASIGNADA|EN_PROCESO|RESUELTA|CERRADA|CANCELADA") String estado) {
}