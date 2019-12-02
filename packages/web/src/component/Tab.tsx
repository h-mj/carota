import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Tab date component props.
 */
interface TabProps {
  /**
   * Whether this tab is highlighted.
   */
  highlighted?: boolean;

  /**
   * Whether this tab is selected.
   */
  selected?: boolean;
}

/**
 * Tab component.
 */
export const Tab = styled.button<TabProps>`
  ${RESET};

  width: 100%;
  height: 100%;
  flex-shrink: 0;

  border-bottom: ${({ highlighted: current, selected, theme }) =>
    selected
      ? `solid 4px ${theme.colorActive}`
      : current
      ? `solid 4px ${theme.borderColor}`
      : `solid 1px ${theme.borderColor}`};
  border-top: ${({ highlighted: current, selected }) =>
    selected || current ? `solid 4px transparent` : `solid 1px transparent`};
  box-sizing: border-box;

  color: ${({ highlighted: current, selected, theme }) =>
    current || selected ? theme.colorPrimary : theme.colorSecondary};
  font-feature-settings: "tnum" 1;
  text-align: center;

  cursor: pointer;

  transition: ${({ theme }) => theme.transition};
`;
