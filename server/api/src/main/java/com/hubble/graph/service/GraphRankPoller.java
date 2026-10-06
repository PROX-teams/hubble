package com.hubble.graph.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = {"graph.async.enabled", "graph.worker.enabled"}, havingValue = "true")
public class GraphRankPoller {
    private final GraphRankWorker worker;

    @Scheduled(fixedDelayString = "${graph.rank.poll-ms:500}")
    public void refreshPending() {
        for (int i = 0; i < 20 && worker.refreshBatch(200) > 0; i++) {
            // Each bounded batch runs in its own transaction.
        }
    }
}
