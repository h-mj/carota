package ee.carota.api

import ee.carota.api.configuration.configureRouting
import io.ktor.server.application.Application

@Suppress("UNUSED")
fun Application.module() {
    configureRouting()
}
