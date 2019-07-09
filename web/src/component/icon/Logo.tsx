import * as React from "react";

export const Logo: React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
> = props => (
  <svg width="32px" height="32px" viewBox="0,0,120,120" {...props}>
    <path
      d="M60,60L28,36A20,20,0,1,1,60,20A20,20,0,1,1,92,36Z"
      fill="rgb(0,180,90)"
    />
    <path
      d="M60,120L28,96A20,20,0,0,1,40,60L80,60A20,20,0,0,1,92,96Z"
      fill="rgb(255, 90, 0)"
    />
  </svg>
);
