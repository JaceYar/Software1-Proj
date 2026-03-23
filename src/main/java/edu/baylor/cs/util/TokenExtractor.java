package edu.baylor.cs.util;

public class TokenExtractor {

    public static String fromHeader(String authorizationHeader) {
        return authorizationHeader != null && authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;
    }
}
