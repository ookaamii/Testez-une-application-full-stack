package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class JwtUtilsTest {

    @Mock
    Authentication authentication;

    @InjectMocks
    JwtUtils jwtUtils;

    @BeforeEach
    public void setup() throws NoSuchFieldException, IllegalAccessException {
        // Ici, Mockito injectera automatiquement les mocks, grâce à InjectMocks.

        String jwtSecret = "secretkey";
        int jwtExpirationMs = 30000;

        // Injection du champ privé jwtSecret
        Field secretField = JwtUtils.class.getDeclaredField("jwtSecret");
        secretField.setAccessible(true); // Rendre le champ accessible
        secretField.set(jwtUtils, jwtSecret);

        // Injection du champ privé jwtExpirationMs
        Field expirationField = JwtUtils.class.getDeclaredField("jwtExpirationMs");
        expirationField.setAccessible(true);
        expirationField.set(jwtUtils, jwtExpirationMs);
    }

    @Test
    public void jwtutils_generateJwtToken() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("daryl@mail.com").build();

        given(authentication.getPrincipal()).willReturn(userDetails);

        // WHEN
        String token = jwtUtils.generateJwtToken(authentication);

        // THEN
        assertThat(token).isNotNull();
        assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("daryl@mail.com");
    }

    @Test
    public void jwtutils_getUserNameFromJwtToken() {
        // GIVEN
        int jwtExpirationMs = 300000;
        String jwtSecret = "secretkey";

        String token = Jwts.builder()
                .setSubject("daryl@mail.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // WHEN
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // THEN
        assertThat(username).isNotNull();
        assertThat(username).isEqualTo("daryl@mail.com");
    }

    @Test
    public void jwtutils_validateJwtToken_ShouldReturnTrueWhenJwtIsValidate() {
        // GIVEN
        int jwtExpirationMs = 300000;
        String jwtSecret = "secretkey";

        String token = Jwts.builder()
                .setSubject("daryl@mail.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // WHEN
        boolean validToken = jwtUtils.validateJwtToken(token);

        // THEN
        assertThat(validToken).isTrue();
    }

    @Test
    public void jwtUtils_validateJwtToken_ShouldReturnErrorWhenMalformedJwtException() {
        // GIVEN : Initialiser un token mal formaté
        String token = "malformate";

        // WHEN : Appeler validateJwtToken avec le token incorrect
        boolean isValid = jwtUtils.validateJwtToken(token);

        // THEN : Vérifier que le token est invalide
        assertThat(isValid).isFalse();
    }

    @Test
    public void jwtUtils_validateJwtToken_ShouldReturnErrorWhenExpiredJwtException() {
        // GIVEN : Initialiser un token qui a expiré
        int jwtExpirationMs = 300000;
        String jwtSecret = "secretkey";

        String token = Jwts.builder()
                .setSubject("daryl@mail.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // WHEN : Appeler validateJwtToken avec le token incorrect
        boolean isValid = jwtUtils.validateJwtToken(token);

        // THEN : Vérifier que le token est invalide
        assertThat(isValid).isFalse();
    }
}
