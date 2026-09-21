package cl.mesatech.catalogo_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.mesatech.catalogo_service.entity.Prioridad;

public interface PrioridadRepository extends JpaRepository<Prioridad, Long> {

    Optional<Prioridad> findByNombreIgnoreCase(String nombre);
}