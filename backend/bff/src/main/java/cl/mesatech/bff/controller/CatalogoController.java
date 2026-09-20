package cl.mesatech.bff.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import cl.mesatech.bff.client.CatalogoClient;

@RestController
@RequestMapping("/v1/catalogo")
public class CatalogoController {

    private final CatalogoClient catalogo;

    public CatalogoController(CatalogoClient catalogo) {
        this.catalogo = catalogo;
    }

    @GetMapping   // cualquier usuario autenticado con el scope
    public Object listar() {
        return catalogo.catalogo();
    }

    @PostMapping("/{recurso}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Object> crear(@PathVariable String recurso, @RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(catalogo.crear(valido(recurso), body));
    }

    @PutMapping("/{recurso}/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Object actualizar(@PathVariable String recurso, @PathVariable Long id,
                             @RequestBody Map<String, Object> body) {
        return catalogo.actualizar(valido(recurso), id, body);
    }

    @DeleteMapping("/{recurso}/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable String recurso, @PathVariable Long id) {
        catalogo.eliminar(valido(recurso), id);
        return ResponseEntity.noContent().build();
    }

    private String valido(String r) {
        if (!r.equals("categorias") && !r.equals("prioridades")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return r;
    }
}
