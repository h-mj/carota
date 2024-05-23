package ee.carota.api.service

import io.opentelemetry.instrumentation.annotations.WithSpan
import io.viascom.nanoid.NanoId

/**
 * The set of characters that are used to generate the public ID.
 */
private const val ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz"

/**
 * Service that generates public IDs.
 */
class PublicIdGenerator {
    /**
     * Generates a public ID with the given [length].
     */
    @WithSpan
    fun generate(length: Int): String {
        return NanoId.generate(length, ALPHABET)
    }
}
