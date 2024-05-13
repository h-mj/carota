package ee.carota.api.route

import ee.carota.api.test.IntegrationTest
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import kotlin.test.Test
import kotlin.test.assertEquals

class IndexTest : IntegrationTest() {
    @Test
    fun `should respond with hello world`() = testApplication {
        val response = client.get("/")

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Hello, world!", response.bodyAsText())
    }
}
