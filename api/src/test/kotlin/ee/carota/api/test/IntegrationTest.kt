package ee.carota.api.test

import io.ktor.client.HttpClientConfig
import io.ktor.client.engine.HttpClientEngineConfig
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.config.ApplicationConfig
import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.config.mergeWith
import io.ktor.server.testing.ApplicationTestBuilder
import org.flywaydb.core.Flyway
import org.flywaydb.core.api.configuration.ClassicConfiguration
import org.junit.jupiter.api.BeforeAll
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

    fun ApplicationTestBuilder.createJsonClient(
        block: HttpClientConfig<out HttpClientEngineConfig>.() -> Unit,
    ) = createClient {
        install(ContentNegotiation) {
            json()
        }

        block()
    }

    companion object {
        @Container
        @JvmStatic
        private val postgres = PostgreSQLContainer("postgres:16.3")

        @BeforeAll
        @JvmStatic
        fun beforeAll() {
            val configuration = ClassicConfiguration().also {
                it.url = postgres.jdbcUrl
                it.user = postgres.username
                it.password = postgres.password
            }

            Flyway(configuration).migrate()
        }
    }
}
