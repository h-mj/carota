import { AccountDto, Language, Rights, Sex, Type } from "server";

import { AccountsStore } from "../store/AccountsStore";

/**
 * Client-side representation of `Account` entity.
 */
export class Account {
  /**
   * Account identifier.
   */
  public readonly id: string;

  /**
   * Account holder's name.
   */
  public readonly name: string;

  /**
   * Account holder's sex.
   */
  public readonly sex: Sex;

  /**
   * Account holder's birth date.
   */
  public readonly birthDate: string;

  /**
   * Application interface language of this account.
   */
  public readonly language: Language;

  /**
   * Account email.
   */
  public readonly email: string;

  /**
   * Account type.
   */
  public readonly type: Type;

  /**
   * Account rights.
   */
  public readonly rights: Rights;

  /**
   * Accounts store instance.
   */
  // @ts-ignore
  private readonly store: AccountsStore;

  /**
   * Creates a new `Account` model based on the data transfer object.
   */
  public constructor(dto: AccountDto, store: AccountsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.sex = dto.sex;
    this.birthDate = dto.birthDate;
    this.language = dto.language;
    this.email = dto.email;
    this.type = dto.type;
    this.rights = dto.rights;
    this.store = store;
  }
}
