import * as React from "react";

import { RootStore } from "../store/RootStore";

/**
 * Component base class with defined default props.
 */
export class Component<TProps = {}> extends React.Component<
  TProps & Partial<RootStore>
> {}
