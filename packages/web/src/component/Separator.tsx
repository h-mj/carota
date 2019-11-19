import { styled } from "../styling/theme";

/**
 * Separator component that displays 1px high line with centered text on top of
 * it.
 */
export const Separator = styled.div`
  width: 100%;
  height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};

  & > span {
    padding: 0 ${({ theme }) => theme.paddingSecondary};
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.colorSecondary};
  }
`;
