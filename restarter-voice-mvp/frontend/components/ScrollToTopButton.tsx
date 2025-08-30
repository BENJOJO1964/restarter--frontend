import React from 'react';

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  show,
  onClick,
  className = '',
  size = 'medium',
  position = 'bottom-right'
}) => {
  if (!show) return null;

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <div 
      className={`scroll-to-top-button ${sizeClasses[size]} ${positionClasses[position]} ${className}`}
      onClick={onClick}
      title="回到頂部"
    >
      <svg 
        width={iconSizes[size]} 
        height={iconSizes[size]} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </div>
  );
};

export default ScrollToTopButton;
