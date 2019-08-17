import { InvitationData } from "api";
import { observable } from "mobx";

import { Model } from "./Model";

export class Invitation extends Model<Invitation, InvitationData>
  implements InvitationData {
  @observable public type!: string;
  @observable public rights!: string;
}
