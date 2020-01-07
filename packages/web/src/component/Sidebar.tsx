import { styled } from "../styling/theme";

/**
 * Sidebar container.
 */
export const Sidebar = styled.div`
  width: ${({ theme }) => theme.widthSmall};
  height: 100%;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.backgroundColor};
  border-right: solid 1px ${({ theme }) => theme.borderColor};

  overflow: auto;

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    width: 100%;
    border-right: none;
  }
`;
