import { InvitationData } from "api";
import { observable } from "mobx";
import { Model } from "./Model";

export class Invitation extends Model<Invitation, InvitationData>
  implements InvitationData {
  @observable type!: string;
  @observable rights!: string;
}
