package ee.carota.api.module.auth.service

import ee.carota.api.configuration.BcryptConfiguration
import kotlin.test.Test
import kotlin.test.assertEquals

class PasswordHashingServiceTest {
    @Test
    fun `should hash a password`() {
        val configuration = BcryptConfiguration(cost = 4)
        val service = PasswordHashingService(configuration)
        val password = "secret123"

        val hash = service.hash(password)

        assertEquals(60, hash.length)
    }

    @Test
    fun `should verify correct password`() {
        val configuration = BcryptConfiguration(cost = 4)
        val service = PasswordHashingService(configuration)
        val password = "secret123"
        val hash = service.hash(password)

        val verified = service.verify(password, hash)

        assertEquals(true, verified)
    }

    @Test
    fun `should verify incorrect password`() {
        val configuration = BcryptConfiguration(cost = 4)
        val service = PasswordHashingService(configuration)
        val password = "secret123"
        val hash = service.hash(password)
        val incorrectPassword = "incorrect123"

        val verified = service.verify(incorrectPassword, hash)

        assertEquals(false, verified)
    }
}
