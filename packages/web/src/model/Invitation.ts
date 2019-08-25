import { AccountRights, AccountTypes, InvitationData } from "api";
import { observable } from "mobx";

import { Model } from "./Model";

export class Invitation extends Model<Invitation, InvitationData>
  implements InvitationData {
  @observable public type!: AccountTypes;
  @observable public rights!: AccountRights;
}
