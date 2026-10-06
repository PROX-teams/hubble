package com.hubble.common.search;

/**
 * Helpers for the MySQL ngram full-text queries used by integrated search.
 */
public final class MysqlFullTextSearch {

    private MysqlFullTextSearch() {
    }

    /**
     * The configured ngram parser uses two-character tokens by default. Keep
     * one-character (and symbol-only) input on the existing LIKE path.
     */
    public static boolean supports(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return false;
        }

        String[] terms = keyword.trim().split("\\s+");
        for (String term : terms) {
            boolean plainTextTerm = term.codePoints().allMatch(Character::isLetterOrDigit);
            long searchableCharacters = term.codePointCount(0, term.length());
            if (!plainTextTerm || searchableCharacters < 2) {
                return false;
            }
        }
        return terms.length > 0;
    }

    /**
     * Boolean-mode input is wrapped as a phrase so user-provided operators do
     * not silently turn into required/excluded terms. Quotes are removed from
     * the phrase delimiters before the value is bound as a SQL parameter.
     */
    public static String phrase(String keyword) {
        String phrase = keyword.trim()
                .replace('\\', ' ')
                .replace('"', ' ')
                .replaceAll("\\s+", " ");
        return "\"" + phrase + "\"";
    }

    public static String likePattern(String keyword) {
        String escaped = keyword.replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_");
        return "%" + escaped + "%";
    }

    public static String likePrefixPattern(String keyword) {
        String escaped = keyword.replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_");
        return escaped + "%";
    }
}
