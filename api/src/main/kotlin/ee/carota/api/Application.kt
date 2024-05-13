package ee.carota.api

import ee.carota.api.configuration.configureDependencyInjection
import ee.carota.api.configuration.configureRouting
import ee.carota.api.configuration.configureSerialization
import io.ktor.server.application.Application

@Suppress("UNUSED")
fun Application.module() {
    configureDependencyInjection()
    configureSerialization()
    configureRouting()
}
