package cl.mesatech.solicitudes_service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "atenciones")
public class Atencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Solicitud solicitud;

    @Column(nullable = false, length = 100)
    private String operadorId;

    @Column(nullable = false, length = 150)
    private String operadorNombre;

    @Column(nullable = false, length = 1000)
    private String detalle;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    public Atencion() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Solicitud getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(Solicitud solicitud) {
        this.solicitud = solicitud;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}