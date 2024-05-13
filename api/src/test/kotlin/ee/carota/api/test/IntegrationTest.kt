package ee.carota.api.test

import io.ktor.server.config.ApplicationConfig
import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.config.mergeWith
import io.ktor.server.testing.ApplicationTestBuilder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import io.ktor.server.testing.testApplication as ktorTestApplication

@Testcontainers
abstract class IntegrationTest {

    fun testApplication(block: suspend ApplicationTestBuilder.() -> Unit) = ktorTestApplication {
        val configuration = MapApplicationConfig(
            "postgres.url" to postgres.jdbcUrl,
            "postgres.username" to postgres.username,
            "postgres.password" to postgres.password,
        )

        environment {
            config = ApplicationConfig(null).mergeWith(configuration)
        }

        block()
    }

    companion object {
        @Container
        @JvmStatic
        private val postgres = PostgreSQLContainer("postgres:16.3")
    }
}
