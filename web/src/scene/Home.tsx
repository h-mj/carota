import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class Home extends SceneComponent<"Home"> {
  public constructor(props: DefaultSceneComponentProps<"Home">) {
    super("Home", props);
  }

  public render() {
    return null;
  }
}
