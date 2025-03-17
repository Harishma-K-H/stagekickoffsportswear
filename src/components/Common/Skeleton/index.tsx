import './index.css';

import React from 'react';

type SkeletonType =
  | 'text'
  | 'title'
  | 'thumbnail'
  | 'profile'
  | 'image'
  | 'customImage'
  | 'icon'
  | 'input'
  | 'label'
  | 'button'
  | 'smallButton';

const SkeletonElement: React.FC<{ type: SkeletonType; className?: string }> = ({
  type,
  className,
}) => {
  return <div className={`skeleton ${type} ${className}`}></div>;
};

export default SkeletonElement;
