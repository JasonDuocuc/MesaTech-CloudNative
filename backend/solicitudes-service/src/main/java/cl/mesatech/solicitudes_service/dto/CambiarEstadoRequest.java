package cl.mesatech.solicitudes_service.dto;

import cl.mesatech.solicitudes_service.enums.EstadoSolicitud;
import jakarta.validation.constraints.NotNull;

public class CambiarEstadoRequest {

    @NotNull
    private EstadoSolicitud estado;

    public CambiarEstadoRequest() {
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }
}