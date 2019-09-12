import * as React from "react";

import { Component } from "../base/Component";
import { styled } from "../styling/theme";

export class Table extends Component {
  public render() {
    return <Container />;
  }
}

const Container = styled.div`
  height: 32rem;
`;
