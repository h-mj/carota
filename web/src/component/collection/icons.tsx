import * as React from "react";

/**
 * Project logo SVG image.
 */
export const Logo: React.FunctionComponent = () => (
  <svg viewBox="0 0 24 10">
    <circle cx="21" cy="5" r="3" fill="rgb(255, 130, 0)" />
    <circle cx="14" cy="5" r="4" fill="rgb(255, 130, 0)" />
    <circle cx="5" cy="5" r="5" fill="rgb(67, 176, 42)" />
  </svg>
);

/**
 * Energy SVG icon.
 */
export const Energy: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 29,0
      L 19,30
      L 42,30
      L 13,68
      L 23,40
      L 0,40
      "
      fill="rgb(67, 176, 42)"
    />
  </svg>
);

/**
 * Protein SVG icon.
 */
export const Protein: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 0,8
      L 42,4
      L 42,12
      L 0,16

      M 0,24
      L 42,20
      L 42,28
      L 0,32

      M 0,40
      L 42,36
      L 42,44
      L 0,48

      M 0,56
      L 42,52
      L 42,60
      L 0,64
      "
      fill="rgb(107, 156, 222)"
    />

    <path
      d="
      M 0,8
      L 42,20
      L 42,28
      L 0,16

      M 0,24
      L 42,36
      L 42,44
      L 0,32

      M 0,40
      L 42,52
      L 42,60
      L 0,48
      "
      fill="rgb(155,199,255)"
    />
  </svg>
);

/**
 * Fat SVG icon.
 */
export const Fat: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 21,3
      L 3,33
      A 21,21 0,1,0 39,33
      L 21,3
      "
      fill="rgb(255, 130, 0)"
    />
  </svg>
);

/**
 * Carbohydrate SVG icon.
 */
export const Carbohydrate: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 21,28
      A 20,20 0,0,0 21,0
      A 20,20 0,0,0 21,28

      M 0,16
      A 20,20 0,0,0 20,36
      A 20,20 0,0,0 0,16

      M 0,32
      A 20,20 0,0,0 20,52
      A 20,20 0,0,0 0,32

      M 0,48
      A 20,20 0,0,0 20,68
      A 20,20 0,0,0 0,48

      M 42,16
      A 20,20 0,0,0 22,36
      A 20,20 0,0,0 42,16

      M 42,32
      A 20,20 0,0,0 22,52
      A 20,20 0,0,0 42,32

      M 42,48
      A 20,20 0,0,0 22,68
      A 20,20 0,0,0 42,48"
      fill="rgb(250, 188, 31)"
    />
  </svg>
);
