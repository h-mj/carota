import { styled } from "../../styling/theme";

/**
 * Component that contains the form control components, for example form submit
 * button.
 */
export const Controls = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  & > *:only-child {
    margin-left: auto;
  }

  @media screen and (max-width: ${({ theme }) => theme.widthSmall}) {
    flex-grow: 1;
  }
`;

/**
 * Form element that wraps `Main` and `Controls` components.
 */
export const Form = styled.form`
  max-width: ${({ theme }) => theme.widthSmall};
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.padding};
  }

  @media screen and (max-width: ${({ theme }) => theme.widthSmall}) {
    flex-grow: 1;
  }
`;

/**
 * Component that displays title text.
 */
export const Title = styled.div`
  color: ${({ theme }) => theme.colorPrimary};
  font-size: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
`;

/**
 * Form helper label.
 */
export const Label = styled.div``;
