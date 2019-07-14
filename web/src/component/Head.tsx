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
 * Component that alters document head tag with updated document title.
 */
@inject("views")
@observer
export class Head extends Component<HeadProps, HeadTranslation> {
  public render() {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          {this.props.title} - {this.translation.title}
        </title>
      </Helmet>
    );
  }
}
