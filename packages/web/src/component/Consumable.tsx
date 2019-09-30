import { styled } from "../styling/theme";

export const Consumable = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  align-items: center;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;
`;
