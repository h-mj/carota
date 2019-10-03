import { styled } from "../../styling/theme";

/**
 * Component that wraps all text components.
 */
// prettier-ignore
export const Texts = styled.div`
  width: 100%;

  display: flex;
  flex-grow: 1;

  /** Padding and line-height add up to theme.height. */
  line-height: ${({ theme }) => theme.lineHeight};
  padding: calc((${({ theme }) => theme.height} - ${({ theme }) => theme.lineHeight}) / 2)
    ${({ theme }) => theme.paddingSecondary};

  box-sizing: border-box;

  color: ${({ theme }) => theme.colorPrimary};
  word-break: break-word;

  & > *:not(:last-child) {
    margin-right: ${({theme}) => theme.paddingSecondary};
  }

  @media screen and (max-width: 50rem) {
    &:not(:only-child) {
      padding-top: calc(${({ theme }) => theme.heightHalf} / 2);
      padding-bottom: 0;
    }
  }
`;
