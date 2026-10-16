package com.hubble.note.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;

/** Explicit opt-in, per-thread diagnostic timing. No request content is collected. */
public final class DraftSaveTiming {
    private static final ThreadLocal<Map<String, Long>> CURRENT = new ThreadLocal<>();
    private DraftSaveTiming() {}

    public static void begin() {
        if (CURRENT.get() != null) throw new IllegalStateException("Timing already active");
        CURRENT.set(new LinkedHashMap<>());
    }
    public static Map<String, Long> end() {
        Map<String, Long> result = CURRENT.get();
        CURRENT.remove();
        return result == null ? Map.of() : Map.copyOf(result);
    }
    static long start() { return CURRENT.get() == null ? 0L : System.nanoTime(); }
    static void finish(String step, long started) {
        Map<String, Long> result = CURRENT.get();
        if (result != null) result.merge(step, System.nanoTime() - started, Long::sum);
    }
    static <T> T measure(String step, Supplier<T> operation) {
        long started = start();
        try { return operation.get(); }
        finally { finish(step, started); }
    }
}
