import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Settings extends SceneComponent<"Settings"> {
  public constructor(props: DefaultSceneComponentProps<"Settings">) {
    super("Settings", props);
  }

  public render() {
    return null;
  }
}
