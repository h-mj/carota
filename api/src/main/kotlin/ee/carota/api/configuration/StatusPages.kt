package ee.carota.api.configuration

import ee.carota.api.response.Errors
import ee.carota.api.util.error
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages

fun Application.configureStatusPages() {
    install(StatusPages) {
        unhandled { call ->
            call.error(Errors.NOT_FOUND)
        }
    }
}
