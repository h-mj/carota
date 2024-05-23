package ee.carota.api.module.auth.service

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import ee.carota.api.service.PublicIdGenerator
import io.opentelemetry.instrumentation.annotations.WithSpan
import org.jetbrains.exposed.sql.transactions.transaction
import java.lang.RuntimeException

/**
 * Account public ID length.
 */
private const val PUBLIC_ID_LENGTH = 12

/**
 * How many times to attempt generating a public ID before giving up.
 */
private const val PUBLIC_ID_GENERATION_ATTEMPTS = 5

/**
 * Service that manages accounts.
 */
class AccountService(
    private val accountDao: AccountDao,
    private val publicIdGenerator: PublicIdGenerator,
) {
    /**
     * Sealed class for account creation errors.
     */
    sealed class CreateError {
        /**
         * Error returned when the email is already used by another account.
         */
        data object EmailAlreadyUsed : CreateError()
    }

    /**
     * Creates a new account with the given [email] and [passwordHash].
     *
     * Returns a result containing the account public ID if the account creation was successful.
     *
     * If there was an error, a result containing one of the following errors is returned:
     * * [CreateError.EmailAlreadyUsed]: The email is already used by another account.
     */
    @WithSpan
    fun create(email: String, passwordHash: String): Result<String, CreateError> {
        repeat(PUBLIC_ID_GENERATION_ATTEMPTS) {
            val publicId = publicIdGenerator.generate(PUBLIC_ID_LENGTH)

            val isPublicIdAlreadyUsed = transaction {
                accountDao.existsByPublicId(publicId)
            }

            if (isPublicIdAlreadyUsed) {
                return@repeat
            }

            val result = transaction {
                accountDao.create(publicId, email, passwordHash)
            }

            return when {
                result.isOk -> Ok(publicId)
                else -> when (result.error) {
                    is AccountDao.CreateError.PublicIdAlreadyUsed -> return@repeat
                    is AccountDao.CreateError.EmailAlreadyUsed -> Err(CreateError.EmailAlreadyUsed)
                }
            }
        }

        // TODO(Henri): Use a custom exception type and log the exception. This is critical.
        throw RuntimeException("Failed to generate a unique public ID")
    }
}
