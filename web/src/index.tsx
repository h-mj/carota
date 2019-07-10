import { Provider } from "mobx-react";
import * as React from "react";
import { render } from "react-dom";
import { Loader } from "./component/Loader";
import { NotificationContainer } from "./component/NotificationContainer";
import { Main } from "./component/Main";
import { Side } from "./component/Side";
import { Theme } from "./component/Theme";
import { rootStore } from "./store/RootStore";

render(
  <Provider {...rootStore}>
    <Theme>
      <Main />
      <Side />
      <Loader />
      <NotificationContainer />
    </Theme>
  </Provider>,
  document.getElementById("root")
);
