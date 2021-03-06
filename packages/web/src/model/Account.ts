import { AccountDto, Language, Rights, Sex, Type } from "server";

import { AccountStore } from "../store/AccountStore";
import { Group } from "./Group";
import { Model } from "./Model";

/**
 * Client-side representation of `Account` entity.
 */
export class Account implements Model {
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
   * Group that this account is part of.
   */
  public group?: Group;

  /**
   * Account store instance.
   */
  private readonly store: AccountStore;

  /**
   * Creates a new `Account` model based on the data transfer object.
   */
  public constructor(
    dto: AccountDto,
    group: Group | undefined,
    store: AccountStore
  ) {
    this.id = dto.id;
    this.name = dto.name;
    this.sex = dto.sex;
    this.birthDate = dto.birthDate;
    this.language = dto.language;
    this.email = dto.email;
    this.type = dto.type;
    this.rights = dto.rights;
    this.group = group;
    this.store = store;

    this.store.register(this);
  }

  /**
   * Inserts this account into specified `group` at given `index`.
   */
  public async insert(group: Group, index: number) {
    this.store.insert(this, group, index);
  }
}
