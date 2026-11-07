package cl.mesatech.catalogo_service.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "outbox_eventos")
public class OutboxEvento {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String tipoEvento;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false)
    private Instant fechaCreacion;

    protected OutboxEvento() {
    }

    public OutboxEvento(
            String id,
            String tipoEvento,
            String payload) {

        this.id = id;
        this.tipoEvento = tipoEvento;
        this.payload = payload;
        this.estado = "PENDIENTE";
        this.fechaCreacion = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public String getPayload() {
        return payload;
    }

    public String getEstado() {
        return estado;
    }

    public Instant getFechaCreacion() {
        return fechaCreacion;
    }

    public void marcarPublicado() {
        this.estado = "PUBLICADO";
    }
}