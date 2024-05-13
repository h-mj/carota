package ee.carota.api.configuration

import ee.carota.api.routes.add
import ee.carota.api.routes.index
import io.ktor.server.application.Application
import io.ktor.server.routing.routing

fun Application.configureRouting() {
    routing {
        index()
        add()
    }
}
