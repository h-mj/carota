import { DefaultSceneProps, Scene } from "./Scene";

export class Settings extends Scene<"Settings"> {
  public constructor(props: DefaultSceneProps<"Settings">) {
    super("Settings", props);
  }

  public render() {
    return null;
  }
}
