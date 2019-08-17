import { Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import { LoadingOverlay } from "./component/LoadingOverlay";
import { Main } from "./component/Main";
import { NotificationContainer } from "./component/NotificationContainer";
import { Side } from "./component/Side";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

render(
  <Provider {...rootStore}>
    <Theme>
      <Main />
      <Side />
      <LoadingOverlay />
      <NotificationContainer />
    </Theme>
  </Provider>,
  document.getElementById("root")
);
