import { styled } from "../styling/theme";

/**
 * Component that wraps either DishView or MealView header items.
 */
// prettier-ignore
export const ItemHeader = styled.div`
  width: 100%;

  min-height: ${({ theme }) => theme.height};

  display: flex;
  flex-grow: 1;

  padding: 0 ${({theme}) => theme.paddingSecondary};
  box-sizing: border-box;

  color: ${({ theme }) => theme.colorPrimary};
  word-break: break-word;

  & > span {
    padding: calc((${({ theme }) => theme.height} - ${({ theme }) => theme.lineHeight}) / 2) 0;
  }

  & > *:not(span) {
    margin-top: calc(${({theme}) => theme.heightHalf} / 2);
  }

  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.paddingSecondary};
  }

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    min-height: 0;

    &:not(:only-child) > * {
      padding-bottom: 0;
    }
  }
`;
