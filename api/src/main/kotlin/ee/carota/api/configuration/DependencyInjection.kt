package ee.carota.api.configuration

import ee.carota.api.service.PublicIdGenerator
import io.ktor.server.application.Application
import io.ktor.server.application.install
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureDependencyInjection() {
    val configuration = Configuration.from(environment.config)

    val module = module {
        single { configuration.bcrypt }
        single { configuration.postgres }
        singleOf(::PublicIdGenerator)
    }

    install(Koin) {
        slf4jLogger()
        modules(module)
    }
}
