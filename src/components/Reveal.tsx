import React, { CSSProperties, ElementType, HTMLAttributes } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  delay?: number;
  variant?: RevealVariant;
};

const Reveal: React.FC<RevealProps> = ({
  as: Component = 'div',
  className,
  delay = 0,
  style,
  variant = 'up',
  ...props
}) => {
  const revealStyle = {
    ...style,
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties;

  return React.createElement(Component, {
    ...props,
    className,
    'data-reveal': variant,
    style: revealStyle,
  });
};

export default Reveal;
