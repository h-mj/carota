import { action, observable } from "mobx";
import { observer, Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import { StageRenderer } from "./base/StageRenderer";
import { Loader } from "./component/Loader";
import { Notifications } from "./component/Notifications";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

/**
 * Root component that loads all necessary data before rendering the application.
 */
@observer
class Application extends React.Component {
  /**
   * Whether all stores have been initialized.
   */
  @observable private initialized = false;

  /**
   * Loads all stores on construction.
   */
  public constructor(props: {}) {
    super(props);

    this.initialize();
  }

  /**
   * Renders the whole application.
   */
  public render() {
    return (
      <Provider {...rootStore}>
        <Theme>
          {this.initialized && <StageRenderer />}
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
  public async initialize() {
    await rootStore.initialize();
    this.initialized = true;
  }
}

render(<Application />, document.getElementById("root"));
