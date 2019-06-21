import { Scene } from "./Scene";

export class Register extends Scene<"register"> {
  public render() {
    return `invitationId: ${this.props.parameters.invitationId}`;
  }
}
