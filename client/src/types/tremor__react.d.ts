declare module '@tremor/react' {
  import { FC, ReactNode } from 'react';

  interface CardProps {
    children: ReactNode;
    className?: string;
    decoration?: 'top' | 'bottom' | 'left' | 'right';
    decorationColor?: string;
    maxWidth?: string;
  }

  interface TitleProps {
    children: ReactNode;
    className?: string;
  }

  interface TextProps {
    children: ReactNode;
    className?: string;
    color?: string;
  }

  export const Card: FC<CardProps>;
  export const Title: FC<TitleProps>;
  export const Text: FC<TextProps>;
  // Add other exports as needed based on what you use from @tremor/react
}
