import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'glass' | 'dark' | 'sunset';
  glow?: boolean;
  maxWidth?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  animated = false,
  hover = false,
  onClick,
  variant = 'default',
  glow = false,
  maxWidth,
}) => {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white shadow-card border border-gray-100',
    gradient: 'bg-gradient-sunset text-white border-none shadow-lg',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg',
    dark: 'bg-night-dark text-white border border-primary-800 shadow-lg',
    sunset: 'bg-property-card text-white border-none shadow-lg',
  };

  const hoverClasses = hover ? 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1' : '';
  const glowClasses = glow ? 'hover:shadow-glow' : '';
  const maxWidthClass = maxWidth ? `${maxWidth}` : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${glowClasses} ${className} ${maxWidthClass}`;

  if (animated) {
    return (
      <motion.div
        className={combinedClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;