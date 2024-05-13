package ee.carota.api.configuration

import ee.carota.api.util.flatten
import io.ktor.server.config.ApplicationConfig
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.properties.Properties
import kotlinx.serialization.properties.decodeFromMap

@Serializable
class Configuration

@OptIn(ExperimentalSerializationApi::class)
fun Configuration.Companion.from(config: ApplicationConfig): Configuration {
    return Properties.decodeFromMap(config.toMap().flatten())
}
