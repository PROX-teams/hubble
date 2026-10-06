package com.hubble.graph.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphEventConsumer {
    private final ObjectMapper objectMapper;
    private final GraphEventProcessor processor;

    @KafkaListener(topics = "graph-note-changes", groupId = "hubble-graph-stats")
    public void consume(String payload) throws Exception {
        processor.process(objectMapper.readValue(payload, GraphNoteChange.class));
    }
}
