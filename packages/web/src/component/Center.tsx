import { styled } from "../styling/theme";

/**
 * Component that takes up whole screen and positions itc children in the middle
 * of the component.
 */
export const Center = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;
