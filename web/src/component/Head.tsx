import { inject, observer } from "mobx-react";
import * as React from "react";
import Helmet from "react-helmet";
import { Component } from "./Component";

/**
 * Head component props.
 */
interface HeadProps {
  /**
   * Document title.
   */
  title: string;
}

/**
 * Head component translation.
 */
interface HeadTranslation {
  /**
   * Application title translation.
   */
  title: string;
}

/**
 * Component that updates document `<head>` element when `title` prop changes.
 */
@inject("views")
@observer
export class Head extends Component<"Head", HeadProps, HeadTranslation> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: HeadProps) {
    super("Head", props);
  }

  /**
   * Renders `Helmet` component that updated document `<head>` element.
   */
  public render() {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/png" href="/favicon-32x32.png" />
        <title>
          {this.props.title} - {this.translation.title}
        </title>
      </Helmet>
    );
  }
}
