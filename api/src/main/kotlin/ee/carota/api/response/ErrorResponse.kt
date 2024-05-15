package ee.carota.api.response

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(
    val error: Error,
)
