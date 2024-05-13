package ee.carota.api.route

import ee.carota.api.routes.AddRequest
import ee.carota.api.routes.AddResponse
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.testApplication
import kotlin.test.Test
import kotlin.test.assertEquals

class AddTest {
    @Test
    fun `should add two integers`() = testApplication {
        val body = AddRequest(1, 2)

        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val response = client.post("/add") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            setBody(body)
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val result = response.body<AddResponse>()

        assertEquals(3, result.result)
    }
}
