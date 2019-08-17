import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Measurements extends SceneComponent<"Measurements"> {
  public constructor(props: DefaultSceneComponentProps<"Measurements">) {
    super("Measurements", props);
  }

  public render() {
    return null;
  }
}
