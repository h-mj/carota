package ee.carota.api.module.auth.route

import ee.carota.api.response.Code
import ee.carota.api.response.DataResponse
import ee.carota.api.response.ErrorResponse
import ee.carota.api.test.IntegrationTest
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import kotlin.test.Test
import kotlin.test.assertEquals

class RegisterTest : IntegrationTest() {
    @Test
    fun `should register a new account`() = testApplication {
        val body = RegisterRequest(
            email = "example@example.com",
            password = "password",
        )

        val client = createJsonClient()

        val response = client.post("/v1/auth:register") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            setBody(body)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val responseBody = response.body<DataResponse<RegisterResponse>>()

        assertEquals(12, responseBody.data.id.length)
    }

    @Test
    fun `should fail to register a new account with an existing email`() = testApplication {
        val body = RegisterRequest(
            email = "account@example.com",
            password = "password",
        )

        val client = createJsonClient()

        val response = client.post("/v1/auth:register") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            setBody(body)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val anotherResponse = client.post("/v1/auth:register") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            setBody(body)
        }

        assertEquals(HttpStatusCode.Conflict, anotherResponse.status)

        val responseBody = anotherResponse.body<ErrorResponse>()

        assertEquals(Code.ALREADY_EXISTS, responseBody.error.code)
    }
}
