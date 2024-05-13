package ee.carota.api.routes

import io.ktor.server.application.call
import io.ktor.server.response.respondText
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get

fun Routing.index() = get("/") {
    call.respondText("Hello, world!")
}
