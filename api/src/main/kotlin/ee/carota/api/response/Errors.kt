package ee.carota.api.response

import io.ktor.http.HttpStatusCode

object Errors {
    val NOT_FOUND = Error(
        status = HttpStatusCode.NotFound.value,
        code = Code.NOT_FOUND,
        message = "Not Found",
    )
}
