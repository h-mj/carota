import { Middleware } from "koa";
import { ForbiddenError } from "../../error/ForbiddenError";
import { sign, verify } from "jsonwebtoken";
import { Account } from "../../entity/Account";
import { BadRequestError } from "../../error/BadRequestError";

/**
 * Type of payload in JWT.
 */
export interface Payload {
  id: string;
}

/**
 * Creates a payload from a given account.
 *
 * @param account Account from which payload is created.
 */
const createPayload = (account: Account): Payload => {
  return { id: account.id };
};

/**
 * Signs a payload generated based on a given account using `SECRET` environment
 * variable.
 *
 * @param account Account from which payload is created.
 */
export const signToken = (account: Account) => {
  return sign(createPayload(account), process.env.SECRET!);
};

/**
 * Middleware state type after both authentication.
 */
export interface AuthenticationState {
  /**
   * Authenticated account.
   */
  account: Account;
}

/**
 * Function that returns a middleware responsible for parsing request
 * `Authorization` header and retrieving and assigning corresponding account to
 * `context.state.account`.
 *
 * If no header is provided, header value is invalid or token inside the header
 * is invalid, `BadRequestError` is thrown.
 */
export const authenticator = (): Middleware<AuthenticationState> => async (
  context,
  next
) => {
  const header = context.request.get("Authorization");

  if (header === "") {
    throw new ForbiddenError('Header field "Authorization" is required.', {
      location: { part: "headers", field: "Authorization" },
      reason: "missing",
      message: 'Header field "Authorization" is required.'
    });
  }

  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new BadRequestError(
      'Syntax of header field "Authorization" must be "Bearer <credentials>".',
      {
        location: { part: "headers", field: "Authorization" },
        reason: "invalid",
        message:
          'Syntax of header field "Authorization" must be "Bearer <credentials>".'
      }
    );
  }

  let payload: Payload;

  try {
    payload = verify(parts[1], process.env.SECRET!) as Payload;
  } catch (error) {
    throw new ForbiddenError(
      'Token provided in header field "Authorization" is incorrect.',
      {
        location: { part: "headers", field: "Authorization" },
        reason: "incorrect",
        message: 'Token provided in header field "Authorization" is incorrect.'
      }
    );
  }

  const account = await Account.findOne(payload);

  if (account === undefined) {
    throw new ForbiddenError(
      'Token provided in header field "Authorization" is valid, but account does not exist.',
      {
        location: { part: "headers", field: "Authorization" },
        reason: "incorrect",
        message:
          'Token provided in header field "Authorization" is valid, but account does not exist.'
      }
    );
  }

  context.state.account = account;

  return next();
};
