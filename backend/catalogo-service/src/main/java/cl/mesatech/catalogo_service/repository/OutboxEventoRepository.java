package cl.mesatech.catalogo_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.mesatech.catalogo_service.entity.OutboxEvento;

public interface OutboxEventoRepository
        extends JpaRepository<OutboxEvento, String> {

    List<OutboxEvento> findByEstadoOrderByFechaCreacionAsc(
            String estado);
}