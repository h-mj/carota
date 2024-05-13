package ee.carota.api.util

import kotlin.test.Test
import kotlin.test.assertEquals

class FlattenTest {
    @Test
    fun `should not affect single level maps`() {
        val map = mapOf(
            "a" to 1,
            "b" to 2,
            "c" to 3,
        )

        val flat = map.flatten()

        val expected = mapOf(
            "a" to 1,
            "b" to 2,
            "c" to 3,
        )

        assertEquals(expected, flat)
    }

    @Test
    fun `should flatten nested maps`() {
        val map = mapOf(
            "a" to 1,
            "b" to mapOf(
                "c" to 2,
                "d" to 3,
            ),
        )

        val flat = map.flatten()

        val expected = mapOf(
            "a" to 1,
            "b.c" to 2,
            "b.d" to 3,
        )

        assertEquals(expected, flat)
    }

    @Test
    fun `should flatten nested lists`() {
        val map = mapOf(
            "a" to 1,
            "b" to listOf(
                2,
                3,
            ),
        )

        val flat = map.flatten()

        val expected = mapOf(
            "a" to 1,
            "b.0" to 2,
            "b.1" to 3,
        )

        assertEquals(expected, flat)
    }

    @Test
    fun `should flatten nested maps and lists`() {
        val map = mapOf(
            "a" to 1,
            "b" to listOf(
                mapOf(
                    "c" to 2,
                    "d" to 3,
                ),
                mapOf(
                    "e" to 4,
                    "f" to 5,
                ),
            ),
        )

        val flat = map.flatten()

        val expected = mapOf(
            "a" to 1,
            "b.0.c" to 2,
            "b.0.d" to 3,
            "b.1.e" to 4,
            "b.1.f" to 5,
        )

        assertEquals(expected, flat)
    }
}
