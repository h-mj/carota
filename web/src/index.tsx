import { Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import { LoadingOverlay } from "./component/LoadingOverlay";
import { NotificationContainer } from "./component/NotificationContainer";
import { Stage } from "./component/Stage";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

render(
  <Provider {...rootStore}>
    <Theme>
      <Stage />
      <LoadingOverlay />
      <NotificationContainer />
    </Theme>
  </Provider>,
  document.getElementById("root")
);
