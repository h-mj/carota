import com.adarshr.gradle.testlogger.theme.ThemeType
import org.gradle.kotlin.dsl.run as runTask

plugins {
    alias(libs.plugins.dotenv)
    alias(libs.plugins.flyway)
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktlint)
    alias(libs.plugins.ktor)
    alias(libs.plugins.test.logger)
}

group = "ee.carota"
version = "0.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.bcrypt)
    implementation(libs.exposed.core)
    implementation(libs.exposed.java.time)
    implementation(libs.exposed.jdbc)
    implementation(libs.hikari.cp)
    implementation(libs.koin.ktor)
    implementation(libs.koin.logger.slf4j)
    implementation(libs.kotlin.result)
    implementation(libs.kotlinx.serialization.properties)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.config.yaml)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.nanoid)
    runtimeOnly(libs.logback.classic)
    runtimeOnly(libs.postgresql)

    testImplementation(libs.flyway.core)
    testImplementation(libs.kotlin.test)
    testImplementation(libs.ktor.client.content.negotiation)
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)
    testRuntimeOnly(libs.flyway.database.postgres)
    testRuntimeOnly(libs.junit.platform.launcher)
}

buildscript {
    dependencies {
        classpath(libs.flyway.database.postgres)
    }
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

flyway {
    url = env.API_POSTGRES_URL.value
    user = env.API_POSTGRES_USERNAME.value
    password = env.API_POSTGRES_PASSWORD.value
}

tasks.runTask {
    environment.putAll(env.allVariables())
}

tasks.test {
    environment.putAll(env.allVariables())

    useJUnitPlatform()
}

testlogger {
    theme = ThemeType.MOCHA_PARALLEL
}
