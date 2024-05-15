package ee.carota.api.response

import io.ktor.http.HttpStatusCode

object Errors {
    val ACCOUNT_ALREADY_EXISTS = Error(
        status = 409,
        code = Code.ALREADY_EXISTS,
        message = "An account with this email already exists",
    )

    val NOT_FOUND = Error(
        status = HttpStatusCode.NotFound.value,
        code = Code.NOT_FOUND,
        message = "Not found",
    )
}
