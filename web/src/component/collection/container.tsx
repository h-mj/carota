import { styled } from "../../styling/theme";

/**
 * Component that takes up whole screen and centers its children.
 */
export const Center = styled.div`
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;
