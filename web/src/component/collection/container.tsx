import { styled } from "../../styling/theme";

/**
 * Component that takes up whole screen and positions itc children in the middle
 * of the component.
 */
export const Center = styled.div`
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
