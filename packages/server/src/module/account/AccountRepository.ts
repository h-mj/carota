import { EntityRepository, Repository } from "typeorm";

import { Account } from "./Account";

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
