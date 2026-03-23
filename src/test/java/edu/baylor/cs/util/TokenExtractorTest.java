package edu.baylor.cs.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenExtractorTest {

    @Test
    void nullInput_returnsNull() {
        assertNull(TokenExtractor.fromHeader(null));
    }

    @Test
    void noBearerPrefix_returnsHeaderAsIs() {
        assertEquals("sometoken", TokenExtractor.fromHeader("sometoken"));
    }

    @Test
    void validBearerToken_stripsPrefix() {
        assertEquals("xyz", TokenExtractor.fromHeader("Bearer xyz"));
    }

    @Test
    void bearerPrefixOnly_returnsEmptyString() {
        assertEquals("", TokenExtractor.fromHeader("Bearer "));
    }
}
