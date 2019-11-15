import { styled } from "../styling/theme";

/**
 * Padded collection of components.
 */
export const Collection = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
