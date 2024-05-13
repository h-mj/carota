package ee.carota.api.routes

import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Routing
import io.ktor.server.routing.post
import kotlinx.serialization.Serializable

@Serializable
data class AddRequest(
    val left: Int,
    val right: Int,
)

@Serializable
data class AddResponse(
    val result: Int,
)

fun Routing.add() = post<AddRequest>("/add") { body ->
    val result = body.left + body.right

    call.respond(AddResponse(result))
}
