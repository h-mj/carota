package ee.carota.api.module.auth

import ee.carota.api.module.auth.route.register
import ee.carota.api.module.auth.service.AccountDao
import ee.carota.api.module.auth.service.AccountService
import ee.carota.api.module.auth.service.PasswordHashingService
import io.ktor.server.application.Application
import io.ktor.server.routing.routing
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module
import org.koin.ktor.plugin.koin

@Suppress("UNUSED")
fun Application.authModule() {
    val module = module {
        singleOf(::AccountDao)
        singleOf(::AccountService)
        singleOf(::PasswordHashingService)
    }

    koin {
        modules(module)
    }

    routing {
        register()
    }
}
