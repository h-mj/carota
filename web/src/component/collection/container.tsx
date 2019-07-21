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
