import { styled } from "../../styling/theme";

/**
 * Component that takes up whole screen and centers its children.
 */
export const Center = styled.div`
  width: 100%;

  display: flex;
  flex: 1 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/**
 * Component that fills entire browser viewport.
 */
export const Overlay = styled.div`
  position: fixed;
  z-index: 1000;

  width: 100%;
  height: 100%;
`;
