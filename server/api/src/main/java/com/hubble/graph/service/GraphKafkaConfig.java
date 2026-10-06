package com.hubble.graph.service;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.util.backoff.FixedBackOff;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphKafkaConfig {
    @Bean
    NewTopic graphNoteChangesTopic(@Value("${graph.kafka.partitions:12}") int partitions,
                                  @Value("${graph.kafka.replicas:1}") int replicas) {
        return TopicBuilder.name("graph-note-changes").partitions(partitions).replicas(replicas).build();
    }

    @Bean
    NewTopic graphNoteChangesDeadLetterTopic(@Value("${graph.kafka.partitions:12}") int partitions,
                                            @Value("${graph.kafka.replicas:1}") int replicas) {
        return TopicBuilder.name("graph-note-changes.DLT").partitions(partitions).replicas(replicas).build();
    }

    @Bean
    DefaultErrorHandler graphKafkaErrorHandler(KafkaTemplate<String, String> kafkaTemplate) {
        // Failed events are retained for inspection/replay instead of being silently skipped.
        return new DefaultErrorHandler(new DeadLetterPublishingRecoverer(kafkaTemplate),
                new FixedBackOff(1000L, 5L));
    }
}
