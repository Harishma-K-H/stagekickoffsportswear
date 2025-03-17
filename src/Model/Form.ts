export interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  title: string;
  className: string;
  disabled?: boolean;
  handleClick?: () => void;
  tooltip?: string;
  icon?: any;
}
