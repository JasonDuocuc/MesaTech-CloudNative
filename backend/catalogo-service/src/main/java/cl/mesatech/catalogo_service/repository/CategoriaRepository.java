package cl.mesatech.catalogo_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.mesatech.catalogo_service.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByNombreIgnoreCase(String nombre);
}