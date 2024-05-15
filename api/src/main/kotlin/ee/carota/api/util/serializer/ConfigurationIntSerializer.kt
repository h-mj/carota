package ee.carota.api.util.serializer

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

class ConfigurationIntSerializer : KSerializer<Int> {
    override val descriptor = PrimitiveSerialDescriptor("ConfigurationIntSerializer", PrimitiveKind.STRING)

    override fun deserialize(decoder: Decoder): Int {
        return decoder.decodeString().toInt()
    }

    override fun serialize(encoder: Encoder, value: Int) {
        throw NotImplementedError("Serializing `Configuration` is not needed.")
    }
}
