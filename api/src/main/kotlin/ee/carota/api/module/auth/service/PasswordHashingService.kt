package ee.carota.api.module.auth.service

import at.favre.lib.crypto.bcrypt.BCrypt
import ee.carota.api.configuration.BcryptConfiguration
import io.opentelemetry.instrumentation.annotations.WithSpan

class PasswordHashingService(private val configuration: BcryptConfiguration) {
    @WithSpan
    fun hash(password: String): String {
        return BCrypt.withDefaults().hashToString(configuration.cost, password.toCharArray())
    }

    @WithSpan
    fun verify(password: String, hash: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hash).verified
    }
}
