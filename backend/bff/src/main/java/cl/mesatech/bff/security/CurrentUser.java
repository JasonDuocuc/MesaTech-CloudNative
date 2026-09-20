package cl.mesatech.bff.security;

import org.springframework.security.oauth2.jwt.Jwt;

public record CurrentUser(String id, String nombre, String email) {

    public static CurrentUser from(Jwt jwt) {
        String id = jwt.getClaimAsString("oid");
        if (id == null) {
            id = jwt.getSubject();
        }
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }
        return new CurrentUser(id, jwt.getClaimAsString("name"), email);
    }
}
