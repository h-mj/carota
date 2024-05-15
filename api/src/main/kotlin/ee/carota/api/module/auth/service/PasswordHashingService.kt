package ee.carota.api.module.auth.service

import at.favre.lib.crypto.bcrypt.BCrypt
import ee.carota.api.configuration.BcryptConfiguration

class PasswordHashingService(private val configuration: BcryptConfiguration) {

    fun hash(password: String): String {
        return BCrypt.withDefaults().hashToString(configuration.cost, password.toCharArray())
    }

    fun verify(password: String, hash: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hash).verified
    }
}
