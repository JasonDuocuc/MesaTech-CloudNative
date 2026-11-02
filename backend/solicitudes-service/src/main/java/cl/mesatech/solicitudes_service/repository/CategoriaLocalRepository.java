package cl.mesatech.solicitudes_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.mesatech.solicitudes_service.entity.CategoriaLocal;

public interface CategoriaLocalRepository
        extends JpaRepository<CategoriaLocal, Long> {

    boolean existsByEventId(String eventId);
}