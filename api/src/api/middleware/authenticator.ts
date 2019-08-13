import { Middleware } from "koa";
import { sign, verify } from "jsonwebtoken";
import { Account } from "../../entity/Account";
import { BadRequestError } from "../../error/BadRequestError";
import { ForbiddenError } from "../../error/ForbiddenError";
import { InternalServerErrorError } from "../../error/InternalServerError";

/**
 * Type of payload within JWT.
 */
export interface Payload {
  /**
   * Account id, which is used to retrieve corresponding account on
   * authentication.
   */
  id: string;
}

/**
 * Creates a payload object that will be signed from a given account.
 *
 * @param account Account from which payload is created.
 */
const createPayload = (account: Account): Payload => {
  return { id: account.id };
};

/**
 * Signs a payload created based on a given account using `SECRET` environment
 * variable.
 *
 * @param account Account from which payload is created.
 */
export const signToken = (account: Account): string => {
  if (process.env.SECRET === undefined) {
    throw new InternalServerErrorError(
      'Environment variable "SECRET" is undefined'
    );
  }

  return sign(createPayload(account), process.env.SECRET);
};

/**
 * Verifies JWT and returns its payload.
 *
 * @param token JWT which will be verified.
 */
const verifyToken = (token: string): Payload => {
  if (process.env.SECRET === undefined) {
    throw new InternalServerErrorError(
      'Environment variable "SECRET" is undefined'
    );
  }

  return verify(token, process.env.SECRET) as Payload;
};

/**
 * Middleware state type after authentication middleware has been run.
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
 * @throws `BadRequestError` if `Authorization` header value structure is
 * invalid.
 * @throws `ForbiddenError` if header is not provided, token is incorrect or
 * associated account does not exist.
 */
export const authenticator = (): Middleware<AuthenticationState> => async (
  context,
  next
): Promise<void> => {
  const header = context.request.get("Authorization");

  if (header === "") {
    throw new ForbiddenError('Header field "Authorization" is required.', {
      location: { part: "headers", path: ["Authorization"] },
      reason: "missing",
      message: 'Header field "Authorization" is required.'
    });
  }

  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new BadRequestError(
      'Syntax of header field "Authorization" must be "Bearer <credentials>".',
      {
        location: { part: "headers", path: ["Authorization"] },
        reason: "invalid",
        message:
          'Syntax of header field "Authorization" must be "Bearer <credentials>".'
      }
    );
  }

  let payload: Payload;

  try {
    payload = verifyToken(parts[1]) as Payload;
  } catch (error) {
    throw new ForbiddenError(
      'Token provided in header field "Authorization" is incorrect.',
      {
        location: { part: "headers", path: ["Authorization"] },
        reason: "incorrect",
        message: 'Token provided in header field "Authorization" is incorrect.'
      }
    );
  }

  const account = await Account.findOne(payload);

  if (account === undefined) {
    throw new ForbiddenError(
      'Token provided in header field "Authorization" is valid, but associated account does not exist.',
      {
        location: { part: "headers", path: ["Authorization"] },
        reason: "incorrect",
        message:
          'Token provided in header field "Authorization" is valid, but associated account does not exist.'
      }
    );
  }

  context.state.account = account;

  return next();
};
