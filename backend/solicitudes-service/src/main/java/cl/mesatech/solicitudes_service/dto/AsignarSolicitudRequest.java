package cl.mesatech.solicitudes_service.dto;

import jakarta.validation.constraints.NotBlank;

public class AsignarSolicitudRequest {

    @NotBlank
    private String operadorId;

    @NotBlank
    private String operadorNombre;

    public AsignarSolicitudRequest() {
    }

    public String getOperadorId() {
        return operadorId;
    }

    public void setOperadorId(String operadorId) {
        this.operadorId = operadorId;
    }

    public String getOperadorNombre() {
        return operadorNombre;
    }

    public void setOperadorNombre(String operadorNombre) {
        this.operadorNombre = operadorNombre;
    }
}