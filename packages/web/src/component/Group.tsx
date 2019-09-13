import { styled } from "../styling/theme";

/**
 * Component that groups together multiple components.
 */
export const Group = styled.div`
  & > *:not(:last-child) {
    margin-bottom: calc(${({ theme }) => theme.padding} / 3);
  }
`;
