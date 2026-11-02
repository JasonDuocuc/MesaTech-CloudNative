package cl.mesatech.solicitudes_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categorias_locales")
public class CategoriaLocal {

    @Id
    @Column(name = "categoria_id")
    private Long categoriaId;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, unique = true, length = 36)
    private String eventId;

    public CategoriaLocal() {
    }

    public CategoriaLocal(
            Long categoriaId,
            String nombre,
            String eventId) {

        this.categoriaId = categoriaId;
        this.nombre = nombre;
        this.eventId = eventId;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }
}