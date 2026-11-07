package cl.mesatech.catalogo_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.mesatech.catalogo_service.dto.CatalogoItemRequest;
import cl.mesatech.catalogo_service.dto.CatalogoResponse;
import cl.mesatech.catalogo_service.dto.CategoriaResponse;
import cl.mesatech.catalogo_service.dto.PrioridadResponse;
import cl.mesatech.catalogo_service.service.CatalogoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/internal/catalogo")
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping
    public CatalogoResponse obtenerCatalogo() {
        return catalogoService.obtenerCatalogo();
    }

    @GetMapping("/categorias/{id}")
    public CategoriaResponse obtenerCategoria(@PathVariable Long id) {
        return catalogoService.obtenerCategoria(id);
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> crearCategoria(
            @Valid @RequestBody CatalogoItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogoService.crearCategoria(request));
    }

    @PutMapping("/categorias/{id}")
    public CategoriaResponse actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CatalogoItemRequest request) {
        return catalogoService.actualizarCategoria(id, request);
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        catalogoService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/prioridades/{id}")
    public PrioridadResponse obtenerPrioridad(@PathVariable Long id) {
        return catalogoService.obtenerPrioridad(id);
    }

    @PostMapping("/prioridades")
    public ResponseEntity<PrioridadResponse> crearPrioridad(
            @Valid @RequestBody CatalogoItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogoService.crearPrioridad(request));
    }

    @PutMapping("/prioridades/{id}")
    public PrioridadResponse actualizarPrioridad(
            @PathVariable Long id,
            @Valid @RequestBody CatalogoItemRequest request) {
        return catalogoService.actualizarPrioridad(id, request);
    }

    @DeleteMapping("/prioridades/{id}")
    public ResponseEntity<Void> eliminarPrioridad(@PathVariable Long id) {
        catalogoService.eliminarPrioridad(id);
        return ResponseEntity.noContent().build();
    }
}