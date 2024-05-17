package ee.carota.api.module.auth.service

import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import ee.carota.api.module.auth.table.Account
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.Table.Dual
import org.jetbrains.exposed.sql.exists
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.intLiteral

/**
 * Provides data access for the account table.
 */
class AccountDao {
    /**
     * Returns whether an account with the given [email] exists.
     */
    fun existsByEmail(email: String): Boolean {
        val exists = exists(Account.select(intLiteral(1)).where { Account.email eq email })

        return Dual.select(exists).single()[exists]
    }

    /**
     * Returns whether an account with the given [publicId] exists.
     */
    fun existsByPublicId(publicId: String): Boolean {
        val exists = exists(Account.select(intLiteral(1)).where { Account.publicId eq publicId })

        return Dual.select(exists).single()[exists]
    }

    /**
     * Sealed class for account creation errors.
     */
    sealed class CreateError {
        /**
         * Error returned when the public ID is already used by another account.
         */
        data object PublicIdAlreadyUsed : CreateError()

        /**
         * Error returned when the email is already used by another account.
         */
        data object EmailAlreadyUsed : CreateError()
    }

    /**
     * Creates an account with the given [publicId], [email] and [passwordHash].
     *
     * Returns a result containing the account ID if the account creation was successful.
     *
     * If there was an error, a result containing one of the following errors is returned:
     * * [CreateError.PublicIdAlreadyUsed]: The public ID is already used by another account.
     */
    fun create(publicId: String, email: String, passwordHash: String): Result<Long, CreateError> {
        val id = try {
            Account.insertAndGetId {
                it[Account.publicId] = publicId
                it[Account.email] = email
                it[Account.passwordHash] = passwordHash
            }
        } catch (exception: ExposedSQLException) {
            // TODO(Henri): Handle unique constraint violation and return an appropriate error.
            throw exception
        }

        return Ok(id.value)
    }
}
