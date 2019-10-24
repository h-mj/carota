import { RESET } from "../styling/stylesheets";
import { css, styled } from "../styling/theme";

/**
 * Plus component props
 */
interface PlusProps {
  /**
   * Whether plus button should be positioned at the bottom right.
   */
  fixed?: boolean;
}

/**
 * Button fixed positioning style.
 */
const fixedStyle = css`
  position: fixed;
  right: ${({ theme }) => theme.heightHalf};
  bottom: ${({ theme }) => theme.heightHalf};
`;

/**
 * Circular button with `+` label.
 */
export const Plus = styled.button<PlusProps>`
  ${RESET};

  z-index: 1;

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colorOrange};

  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
    0 0.1rem 0.25rem rgba(0, 0, 0, 0.1);

  color: ${({ theme }) => theme.colorPrimary};
  font-feature-settings: "case";
  font-size: 2rem;
  text-align: center;

  cursor: pointer;

  ${({ fixed }) => fixed && fixedStyle};
`;
