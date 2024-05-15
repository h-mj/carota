package ee.carota.api.module.auth.service

import ee.carota.api.module.auth.table.Account
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.intLiteral

class AccountDao {

    fun existsByEmail(email: String): Boolean {
        val existsByEmail = exists(Account.select(intLiteral(1)).where { Account.email eq email })

        return Table.Dual.select(existsByEmail).single()[existsByEmail]
    }

    fun create(publicId: String, email: String, passwordHash: String): Long {
        val id = Account.insertAndGetId {
            it[Account.publicId] = publicId
            it[Account.email] = email
            it[Account.passwordHash] = passwordHash
        }

        return id.value
    }
}
