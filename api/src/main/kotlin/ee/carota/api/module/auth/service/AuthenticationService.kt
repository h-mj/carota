package ee.carota.api.module.auth.service

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.mapError
import io.opentelemetry.instrumentation.annotations.WithSpan
import org.jetbrains.exposed.sql.transactions.transaction
import ee.carota.api.module.auth.service.AccountService.CreateError as AccountCreateError

/**
 * Service that provides authentication functionality.
 */
class AuthenticationService(
    private val accountDao: AccountDao,
    private val accountService: AccountService,
    private val passwordHashingService: PasswordHashingService,
) {
    /**
     * Sealed class for registration errors.
     */
    sealed class RegisterError {
        /**
         * Error returned when the email is already used by another account.
         */
        data object EmailAlreadyUsed : RegisterError()
    }

    /**
     * Registers a new account with the given [email] and [password].
     *
     * Returns a result containing the account public ID if the registration was successful.
     *
     * If there was an error, a result containing one of the following errors is returned:
     * * [RegisterError.EmailAlreadyUsed]: The email is already used by another account.
     */
    @WithSpan
    fun register(email: String, password: String): Result<String, RegisterError> {
        val isEmailAlreadyUsed = transaction {
            accountDao.existsByEmail(email)
        }

        if (isEmailAlreadyUsed) {
            return Err(RegisterError.EmailAlreadyUsed)
        }

        val passwordHash = passwordHashingService.hash(password)

        val result = accountService.create(email, passwordHash)

        return result.mapError { it.toRegisterError() }
    }

    /**
     * Converts an [AccountCreateError] to a [RegisterError].
     */
    private fun AccountCreateError.toRegisterError(): RegisterError {
        return when (this) {
            AccountCreateError.EmailAlreadyUsed -> RegisterError.EmailAlreadyUsed
        }
    }
}
