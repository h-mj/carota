import { AccountRights, AccountTypes, InvitationDto } from "api";

/**
 * Invitation entity client-side representation.
 */
export class Invitation {
  /**
   * Invitation ID.
   */
  public readonly id: string;

  /**
   * Future created account rights.
   */
  public readonly rights: AccountRights;

  /**
   * Future created account type.
   */
  public readonly type: AccountTypes;

  /**
   * Creates an `Invitation` model based on its data transfer object.
   */
  public constructor(dto: InvitationDto) {
    this.id = dto.id;
    this.rights = dto.rights;
    this.type = dto.type;
  }
}
