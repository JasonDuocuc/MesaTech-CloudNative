package cl.mesatech.catalogo_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.mesatech.catalogo_service.dto.CatalogoItemRequest;
import cl.mesatech.catalogo_service.dto.CatalogoResponse;
import cl.mesatech.catalogo_service.dto.CategoriaResponse;
import cl.mesatech.catalogo_service.dto.PrioridadResponse;
import cl.mesatech.catalogo_service.entity.Categoria;
import cl.mesatech.catalogo_service.entity.Prioridad;
import cl.mesatech.catalogo_service.exception.RecursoNoEncontradoException;
import cl.mesatech.catalogo_service.exception.ReglaNegocioException;
import cl.mesatech.catalogo_service.repository.CategoriaRepository;
import cl.mesatech.catalogo_service.repository.PrioridadRepository;

@Service
@Transactional
public class CatalogoService {

    private final CategoriaRepository categoriaRepository;
    private final PrioridadRepository prioridadRepository;

    public CatalogoService(
            CategoriaRepository categoriaRepository,
            PrioridadRepository prioridadRepository) {
        this.categoriaRepository = categoriaRepository;
        this.prioridadRepository = prioridadRepository;
    }

    @Transactional(readOnly = true)
    public CatalogoResponse obtenerCatalogo() {
        List<CategoriaResponse> categorias = categoriaRepository.findAll()
                .stream()
                .map(this::toCategoriaResponse)
                .toList();

        List<PrioridadResponse> prioridades = prioridadRepository.findAll()
                .stream()
                .map(this::toPrioridadResponse)
                .toList();

        return new CatalogoResponse(categorias, prioridades);
    }

    @Transactional(readOnly = true)
    public CategoriaResponse obtenerCategoria(Long id) {
        return toCategoriaResponse(buscarCategoria(id));
    }

    public CategoriaResponse crearCategoria(CatalogoItemRequest request) {
        validarCategoriaDuplicada(request.nombre(), null);

        Categoria categoria = new Categoria(request.nombre().trim());

        return toCategoriaResponse(categoriaRepository.save(categoria));
    }

    public CategoriaResponse actualizarCategoria(Long id, CatalogoItemRequest request) {
        Categoria categoria = buscarCategoria(id);

        validarCategoriaDuplicada(request.nombre(), id);

        categoria.setNombre(request.nombre().trim());

        return toCategoriaResponse(categoriaRepository.save(categoria));
    }

    public void eliminarCategoria(Long id) {
        Categoria categoria = buscarCategoria(id);
        categoriaRepository.delete(categoria);
    }

    @Transactional(readOnly = true)
    public PrioridadResponse obtenerPrioridad(Long id) {
        return toPrioridadResponse(buscarPrioridad(id));
    }

    public PrioridadResponse crearPrioridad(CatalogoItemRequest request) {
        validarPrioridadDuplicada(request.nombre(), null);

        Prioridad prioridad = new Prioridad(request.nombre().trim());

        return toPrioridadResponse(prioridadRepository.save(prioridad));
    }

    public PrioridadResponse actualizarPrioridad(Long id, CatalogoItemRequest request) {
        Prioridad prioridad = buscarPrioridad(id);

        validarPrioridadDuplicada(request.nombre(), id);

        prioridad.setNombre(request.nombre().trim());

        return toPrioridadResponse(prioridadRepository.save(prioridad));
    }

    public void eliminarPrioridad(Long id) {
        Prioridad prioridad = buscarPrioridad(id);
        prioridadRepository.delete(prioridad);
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Categoría no encontrada: " + id));
    }

    private Prioridad buscarPrioridad(Long id) {
        return prioridadRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Prioridad no encontrada: " + id));
    }

    private void validarCategoriaDuplicada(String nombre, Long idActual) {
        categoriaRepository.findByNombreIgnoreCase(nombre.trim())
                .filter(categoria -> !categoria.getId().equals(idActual))
                .ifPresent(categoria -> {
                    throw new ReglaNegocioException(
                            "Ya existe una categoría con el nombre: " + nombre.trim());
                });
    }

    private void validarPrioridadDuplicada(String nombre, Long idActual) {
        prioridadRepository.findByNombreIgnoreCase(nombre.trim())
                .filter(prioridad -> !prioridad.getId().equals(idActual))
                .ifPresent(prioridad -> {
                    throw new ReglaNegocioException(
                            "Ya existe una prioridad con el nombre: " + nombre.trim());
                });
    }

    private CategoriaResponse toCategoriaResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre());
    }

    private PrioridadResponse toPrioridadResponse(Prioridad prioridad) {
        return new PrioridadResponse(
                prioridad.getId(),
                prioridad.getNombre());
    }
}