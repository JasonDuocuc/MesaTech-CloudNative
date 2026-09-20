package cl.mesatech.solicitudes_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CrearSolicitudRequest {

    @NotBlank
    private String titulo;

    @NotBlank
    private String descripcion;

    @NotNull
    private Long categoriaId;

    @NotBlank
    private String categoriaNombre;

    @NotNull
    private Long prioridadId;

    @NotBlank
    private String prioridadNombre;

    @NotBlank
    private String solicitanteId;

    @NotBlank
    private String solicitanteNombre;

    @NotBlank
    private String solicitanteEmail;

    public CrearSolicitudRequest() {
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }

    public Long getPrioridadId() {
        return prioridadId;
    }

    public void setPrioridadId(Long prioridadId) {
        this.prioridadId = prioridadId;
    }

    public String getPrioridadNombre() {
        return prioridadNombre;
    }

    public void setPrioridadNombre(String prioridadNombre) {
        this.prioridadNombre = prioridadNombre;
    }

    public String getSolicitanteId() {
        return solicitanteId;
    }

    public void setSolicitanteId(String solicitanteId) {
        this.solicitanteId = solicitanteId;
    }

    public String getSolicitanteNombre() {
        return solicitanteNombre;
    }

    public void setSolicitanteNombre(String solicitanteNombre) {
        this.solicitanteNombre = solicitanteNombre;
    }

    public String getSolicitanteEmail() {
        return solicitanteEmail;
    }

    public void setSolicitanteEmail(String solicitanteEmail) {
        this.solicitanteEmail = solicitanteEmail;
    }
}