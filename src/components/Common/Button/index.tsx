import { ButtonProps } from '@models/Form';
import React from 'react';

import PageLoader from '../PageLoader';

export const Button: React.FC<ButtonProps> = ({
  className,
  type,
  title,
  disabled = false,
  handleClick,
  tooltip,
  icon,
}) => {
  const onClickHandler = () => {
    if (handleClick) {
      handleClick();
    }
  };

  return (
    <button
      onClick={onClickHandler}
      className={`px-[25px] py-3 transition-all ${className}`}
      type={type}
      disabled={disabled}
      title={tooltip}
    >
      {icon && icon}
      {title}
      {disabled && <PageLoader />}
    </button>
  );
};

export default Button;
