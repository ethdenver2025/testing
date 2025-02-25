import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  interactive = false,
  elevated = false,
}) => {
  const baseStyles = 'rounded-xl bg-white p-6';
  const elevationStyles = elevated ? 'shadow-lg' : 'shadow-md';
  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:shadow-lg'
    : '';

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`${baseStyles} ${elevationStyles} ${interactiveStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};
