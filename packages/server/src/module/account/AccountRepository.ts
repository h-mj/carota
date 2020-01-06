import { EntityRepository, Repository } from "typeorm";

import { Account } from "./Account";

/**
 * Repository responsible for managing `Account` entities.
 */
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
