import { action, observable } from "mobx";
import { observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import { Loader } from "./component/Loader";
import { Notifications } from "./component/Notifications";
import { Stage } from "./component/Stage";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

/**
 * Root component that loads all necessary data before rendering the application.
 */
@observer
class Application extends React.Component {
  /**
   * Whether all stores have been loaded.
   */
  @observable private loaded = false;

  /**
   * Loads all stores on construction.
   */
  public constructor(props: {}) {
    super(props);

    this.load();
  }

  /**
   * Renders the whole application.
   */
  public render() {
    return (
      <Provider {...rootStore}>
        <Theme>
          {this.loaded && <Stage />}
          <Loader />
          <Notifications />
        </Theme>
      </Provider>
    );
  }

  /**
   * Loads the application.
   */
  @action
  public async load() {
    rootStore.load();
    this.loaded = true;
  }
}

render(<Application />, document.getElementById("root"));
