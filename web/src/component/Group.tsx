import { styled } from "../styling/theme";

/**
 * Component that groups together multiple components.
 */
export const Group = styled.div`
  & > * {
    margin-bottom: calc(${({ theme }) => theme.padding} / 3);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
