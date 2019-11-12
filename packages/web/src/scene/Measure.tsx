import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Measure extends SceneComponent<"Measure"> {
  public constructor(props: DefaultSceneComponentProps<"Measure">) {
    super("Measure", props);
  }

  public render() {
    return null;
  }
}
