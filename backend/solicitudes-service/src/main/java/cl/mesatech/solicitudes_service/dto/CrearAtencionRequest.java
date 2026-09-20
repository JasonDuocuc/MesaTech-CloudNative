package cl.mesatech.solicitudes_service.dto;

import jakarta.validation.constraints.NotBlank;

public class CrearAtencionRequest {

    @NotBlank
    private String operadorId;

    @NotBlank
    private String operadorNombre;

    @NotBlank
    private String detalle;

    public CrearAtencionRequest() {
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

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}