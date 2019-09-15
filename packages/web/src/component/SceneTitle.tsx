import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";

/**
 * Scene title component props.
 */
interface SceneTitleProps {
  /**
   * Scene which title is being altered.
   */
  scene: Scenes;

  /**
   * Scene title.
   */
  title: string;
}

/**
 * Alters scene title to specified title.
 */
export class SceneTitle extends Component<SceneTitleProps> {
  /**
   * Update title on mount.
   */
  public componentDidMount() {
    this.props.scene.title = this.props.title;
  }

  /**
   * Update title on update.
   */
  public componentDidUpdate() {
    this.props.scene.title = this.props.title;
  }

  /**
   * Don't render anything.
   */
  public render() {
    return null;
  }
}
