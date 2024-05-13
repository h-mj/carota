import com.adarshr.gradle.testlogger.theme.ThemeType
import org.gradle.kotlin.dsl.run as runTask

plugins {
    val kotlinVersion = "1.9.24"

    kotlin("jvm") version kotlinVersion
    kotlin("plugin.serialization") version kotlinVersion
    id("io.ktor.plugin") version "2.3.11"
    id("co.uzzu.dotenv.gradle") version "4.0.0"
    id("com.adarshr.test-logger") version "4.0.0"
}

group = "ee.carota"
version = "0.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(platform("io.insert-koin:koin-bom:3.5.6"))

    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")
    implementation("io.ktor:ktor-serialization-kotlinx-json")
    implementation("io.ktor:ktor-server-config-yaml")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-properties")
    runtimeOnly("ch.qos.logback:logback-classic:1.5.6")

    testImplementation(kotlin("test"))
    testImplementation("io.ktor:ktor-client-content-negotiation")
    testImplementation("io.ktor:ktor-server-test-host")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

tasks.runTask {
    environment.putAll(env.allVariables())
}

tasks.test {
    useJUnitPlatform()
}

testlogger {
    theme = ThemeType.MOCHA_PARALLEL
}
