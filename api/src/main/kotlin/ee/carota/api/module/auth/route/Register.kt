package ee.carota.api.module.auth.route

import ee.carota.api.module.auth.service.AuthenticationService
import ee.carota.api.module.auth.service.AuthenticationService.RegisterError
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
    val publicId: String,
)

fun Routing.register() = post<RegisterRequest>("/v1/auth:register") { body ->
    val authenticationService by context.inject<AuthenticationService>()

    val result = authenticationService.register(body.email, body.password)

    when {
        result.isOk -> call.data(RegisterResponse(result.value))
        else -> when (result.error) {
            RegisterError.EmailAlreadyUsed -> call.error(Errors.ACCOUNT_ALREADY_EXISTS)
        }
    }
}
