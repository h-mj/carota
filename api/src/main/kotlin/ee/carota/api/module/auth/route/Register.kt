package ee.carota.api.module.auth.route

import ee.carota.api.module.auth.service.AccountService
import ee.carota.api.module.auth.service.AccountService.CreateAccountError
import ee.carota.api.response.Errors
import ee.carota.api.util.data
import ee.carota.api.util.error
import io.ktor.server.application.call
import io.ktor.server.routing.Routing
import io.ktor.server.routing.post
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
)

@Serializable
data class RegisterResponse(
    val id: String,
)

fun Routing.register() = post<RegisterRequest>("/v1/auth:register") { body ->
    // TODO(Henri): Validate that email and password are OK.
    val accountService by context.inject<AccountService>()

    val result = accountService.create(body.email, body.password)

    if (result.isOk) {
        call.data(RegisterResponse(result.value.publicId))
    } else when (result.error) {
        CreateAccountError.Exists -> call.error(Errors.ACCOUNT_ALREADY_EXISTS)
    }
}
