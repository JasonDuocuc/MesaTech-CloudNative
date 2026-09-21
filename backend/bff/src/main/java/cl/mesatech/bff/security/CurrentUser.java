package cl.mesatech.bff.security;

import org.springframework.security.oauth2.jwt.Jwt;

public record CurrentUser(String id, String nombre, String email) {

    public static CurrentUser from(Jwt jwt) {
        String id = jwt.getClaimAsString("oid");
        if (id == null) {
            id = jwt.getSubject();
        }

        String email = jwt.getClaimAsString("email");
        if (email == null)
            email = jwt.getClaimAsString("preferred_username");
        if (email == null)
            email = jwt.getClaimAsString("upn");
        if (email == null)
            email = jwt.getClaimAsString("unique_name");

        String nombre = jwt.getClaimAsString("name");
        if (nombre == null)
            nombre = email;
        return new CurrentUser(id, nombre, email);
    }
}