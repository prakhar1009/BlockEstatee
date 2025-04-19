import React from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient' | 'sunset';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  animated?: boolean;
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  animated = false,
  glow = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-md',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 hover:text-primary-700 p-0 h-auto',
    gradient: 'bg-gradient-sunset text-white hover:bg-gradient-sunset shadow-md',
    sunset: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-md',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  const animatedClasses = animated ? 'transform hover:scale-105 active:scale-95' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const glowClass = glow ? 'hover:shadow-glow' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${animatedClasses} ${widthClass} ${glowClass} ${className}`;
  
  const content = (
    <>
      {isLoading ? (
        <Loader size="small" color={variant === 'primary' || variant === 'gradient' || variant === 'sunset' || variant === 'secondary' ? 'white' : 'primary'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </>
  );
  
  if (href) {
    if (external) {
      return (
        <a 
          href={href} 
          className={classes}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {content}
    </button>
  );
};

export default Button;