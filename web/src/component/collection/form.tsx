import { styled } from "../../styling/theme";

/**
 * Component that contains the form control components, for example form submit
 * button.
 */
export const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
`;

/**
 * Form element that wraps `Main` and `Controls` components.
 */
export const Form = styled.form`
  min-height: calc(9 * ${({ theme }) => theme.HEIGHT});
  max-width: ${({ theme }) => theme.FORM_WIDTH};
  width: 100%;

  padding: ${({ theme }) => theme.PADDING};
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.PADDING};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that groups together multiple inputs.
 */
export const Group = styled.div`
  width: 100%;

  & > * {
    margin-bottom: calc(${({ theme }) => theme.PADDING} / 3);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that displays title text.
 */
export const Title = styled.div`
  line-height: ${({ theme }) => theme.HEIGHT};
  color: ${({ theme }) => theme.PRIMARY_COLOR};
  font-size: 1.5rem;
  text-align: center;
`;
