import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Diet extends SceneComponent<"Diet"> {
  public constructor(props: DefaultSceneComponentProps<"Diet">) {
    super("Diet", props);
  }

  public render() {
    return null;
  }
}
