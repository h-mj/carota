package ee.carota.api.routes

import ee.carota.api.service.GreetingService
import io.ktor.server.application.call
import io.ktor.server.response.respondText
import io.ktor.server.routing.Routing
import io.ktor.server.routing.get
import org.koin.ktor.ext.inject

fun Routing.index() = get("/") {
    val greetingService by context.inject<GreetingService>()

    call.respondText(greetingService.getGreeting())
}
