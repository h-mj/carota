import { styled } from "../styling/theme";

/**
 * Component that wraps either DishView or MealView header items.
 */
export const ItemHeader = styled.div`
  width: 100%;

  display: grid;
  grid-gap: calc(${({ theme }) => theme.heightHalf} / 2);
  grid-template-columns: 1fr 1fr;

  & > *:only-child {
    grid-column-start: span 2;
  }

  padding: calc(${({ theme }) => theme.heightHalf} / 2);
  box-sizing: border-box;

  box-shadow: 0 1px 0 0 ${({ theme }) => theme.borderColor};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Display flex component.
 */
export const ItemHeaderTexts = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: calc(${({ theme }) => theme.heightHalf} / 2);
  }
`;

/**
 * Item title wrapper component.
 */
// prettier-ignore
export const ItemHeaderText = styled.div`
  display: flex;
  flex-grow: 1;

  padding: calc((${({theme}) => theme.heightHalf} - ${({ theme }) => theme.lineHeight}) / 2) 0;

  color: ${({theme}) => theme.colorPrimary};
  line-height: ${({ theme }) => theme.lineHeight};
`;
