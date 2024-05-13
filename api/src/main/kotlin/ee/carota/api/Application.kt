package ee.carota.api

import ee.carota.api.configuration.configureRouting
import ee.carota.api.configuration.configureSerialization
import io.ktor.server.application.Application

@Suppress("UNUSED")
fun Application.module() {
    configureSerialization()
    configureRouting()
}
