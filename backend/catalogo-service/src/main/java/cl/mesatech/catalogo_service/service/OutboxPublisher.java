package cl.mesatech.catalogo_service.service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import cl.mesatech.catalogo_service.entity.OutboxEvento;
import cl.mesatech.catalogo_service.repository.OutboxEventoRepository;

@Service
public class OutboxPublisher {

    private static final Logger log =
            LoggerFactory.getLogger(OutboxPublisher.class);

    private static final String EXCHANGE =
            "mesatech.catalogo.exchange";

    private static final String ROUTING_KEY =
            "categoria.creada";

    private final OutboxEventoRepository outboxEventoRepository;
    private final RabbitTemplate rabbitTemplate;

    public OutboxPublisher(
            OutboxEventoRepository outboxEventoRepository,
            RabbitTemplate rabbitTemplate) {

        this.outboxEventoRepository = outboxEventoRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Scheduled(fixedDelayString = "${OUTBOX_INTERVAL_MS:5000}")
    public void publicarPendientes() {

        List<OutboxEvento> pendientes =
                outboxEventoRepository
                        .findByEstadoOrderByFechaCreacionAsc("PENDIENTE");

        for (OutboxEvento evento : pendientes) {
            publicarEvento(evento);
        }
    }

    private void publicarEvento(OutboxEvento evento) {

        try {
            MessageProperties properties = new MessageProperties();

            properties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
            properties.setContentEncoding(StandardCharsets.UTF_8.name());
            properties.setDeliveryMode(MessageDeliveryMode.PERSISTENT);
            properties.setMessageId(evento.getId());

            Message mensaje = new Message(
                    evento.getPayload().getBytes(StandardCharsets.UTF_8),
                    properties);

            CorrelationData correlationData =
                    new CorrelationData(evento.getId());

            rabbitTemplate.send(
                    EXCHANGE,
                    ROUTING_KEY,
                    mensaje,
                    correlationData);

            CorrelationData.Confirm confirmacion =
                    correlationData.getFuture().get(10, TimeUnit.SECONDS);

            if (!confirmacion.ack()) {
                log.warn(
                        "RabbitMQ no confirmó el evento {}: {}",
                        evento.getId(),
                        confirmacion.reason());
                return;
            }

            if (correlationData.getReturned() != null) {
                log.warn(
                        "RabbitMQ devolvió el evento {} por falta de ruta",
                        evento.getId());
                return;
            }

            evento.marcarPublicado();
            outboxEventoRepository.save(evento);

            log.info(
                    "Evento {} publicado correctamente",
                    evento.getId());

        } catch (Exception ex) {
            log.warn(
                    "No se pudo publicar el evento {}. Se reintentará. Causa: {}",
                    evento.getId(),
                    ex.getMessage());
        }
    }
}