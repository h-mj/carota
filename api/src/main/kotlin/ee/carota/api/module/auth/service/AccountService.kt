package ee.carota.api.module.auth.service

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import ee.carota.api.service.PublicIdGenerator
import org.jetbrains.exposed.sql.transactions.transaction

class AccountService(
    private val accountDao: AccountDao,
    private val passwordHashingService: PasswordHashingService,
    private val publicIdGenerator: PublicIdGenerator,
) {
    data class CreateAccountData(val id: Long, val publicId: String)

    sealed class CreateAccountError {
        data object Exists : CreateAccountError()
    }

    fun create(email: String, password: String): Result<CreateAccountData, CreateAccountError> {
        val accountExists = transaction {
            accountDao.existsByEmail(email)
        }

        if (accountExists) {
            return Err(CreateAccountError.Exists)
        }

        val publicId = publicIdGenerator.generate()
        val passwordHash = passwordHashingService.hash(password)

        // TODO(Henri): Handle publicId collisions.
        val id = transaction {
            accountDao.create(publicId, email, passwordHash)
        }

        return Ok(CreateAccountData(id, publicId))
    }
}
