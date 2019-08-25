import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Administration extends SceneComponent<"Administration"> {
  public constructor(props: DefaultSceneComponentProps<"Administration">) {
    super("Administration", props);
  }

  public render() {
    return null;
  }
}
