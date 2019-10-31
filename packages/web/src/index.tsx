import { Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";

import { Loader } from "./component/Loader";
import { Notifications } from "./component/Notifications";
import { Stage } from "./component/Stage";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

render(
  <Provider {...rootStore}>
    <Theme>
      <Stage />
      <Loader />
      <Notifications />
    </Theme>
  </Provider>,
  document.getElementById("root")
);
