import * as React from "react";

import { RootStore } from "../store/RootStore";

/**
 * Component base class.
 */
export abstract class Component<TProps = {}> extends React.Component<
  TProps & Partial<RootStore>
> {}
