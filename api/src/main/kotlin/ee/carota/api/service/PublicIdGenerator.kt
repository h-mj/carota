package ee.carota.api.service

import io.viascom.nanoid.NanoId

private const val ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz"
private const val LENGTH = 12

class PublicIdGenerator {
    fun generate(): String {
        return NanoId.generate(LENGTH, ALPHABET)
    }
}
