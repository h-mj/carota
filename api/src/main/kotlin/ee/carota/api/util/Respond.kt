package ee.carota.api.util

import ee.carota.api.response.Error
import ee.carota.api.response.ErrorResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond

suspend fun ApplicationCall.error(error: Error) {
    respond(HttpStatusCode.fromValue(error.status), ErrorResponse(error))
}
