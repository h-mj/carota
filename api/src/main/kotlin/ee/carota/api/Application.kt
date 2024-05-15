package ee.carota.api

import ee.carota.api.configuration.configureDatabase
import ee.carota.api.configuration.configureDependencyInjection
import ee.carota.api.configuration.configureRouting
import ee.carota.api.configuration.configureSerialization
import ee.carota.api.configuration.configureStatusPages
import io.ktor.server.application.Application

@Suppress("UNUSED")
fun Application.module() {
    configureDependencyInjection()
    configureDatabase()
    configureSerialization()
    configureStatusPages()
    configureRouting()
}
