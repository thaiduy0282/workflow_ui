import React from 'react';

export const clickBorderEffect = (elementRef: React.RefObject<any>, color: string) => {
  const ele = elementRef.current;

  if (ele) {
    ele.style.borderColor = color;
  }
  setTimeout(() => {
    if (ele) ele.style.borderColor = 'transparent';
  }, 200);
};
