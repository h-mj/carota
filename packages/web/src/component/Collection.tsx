import { styled } from "../styling/theme";

export const Collection = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
