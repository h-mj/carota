package ee.carota.api.configuration

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.Application
import org.jetbrains.exposed.sql.Database
import org.koin.ktor.ext.inject

fun Application.configureDatabase() {
    val configuration by inject<PostgresConfiguration>()

    val hikariConfiguration = HikariConfig().also {
        it.jdbcUrl = configuration.url
        it.username = configuration.username
        it.password = configuration.password
        it.isAutoCommit = false
        it.transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        it.validate()
    }

    val dataSource = HikariDataSource(hikariConfiguration)

    Database.connect(dataSource)
}
