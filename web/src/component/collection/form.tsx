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
  min-height: calc(9 * ${({ theme }) => theme.height});
  max-width: ${({ theme }) => theme.formWidth};
  width: 100%;

  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that groups together multiple components.
 */
export const Group = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    margin-bottom: calc(${({ theme }) => theme.padding} / 3);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Component that displays title text.
 */
export const Title = styled.div`
  line-height: ${({ theme }) => theme.height};
  color: ${({ theme }) => theme.primaryColor};
  font-size: 1.5rem;
  text-align: center;
`;
