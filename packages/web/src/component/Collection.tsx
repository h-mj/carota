import { styled } from "../styling/theme";

export const Collection = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
