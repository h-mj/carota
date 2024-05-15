package ee.carota.api.response

import kotlinx.serialization.Serializable

@Serializable
data class Error(
    val status: Int,
    val code: Code,
    val message: String,
)
