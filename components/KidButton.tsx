
import React from 'react';

interface KidButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'pink' | 'yellow' | 'red';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const KidButton: React.FC<KidButtonProps> = ({ 
  onClick, 
  children, 
  color = 'blue', 
  className = '', 
  size = 'md',
  disabled = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-400 border-blue-600 hover:bg-blue-500 shadow-[0_6px_0_0_rgba(30,58,138,1)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(30,58,138,1)]',
    green: 'bg-green-400 border-green-600 hover:bg-green-500 shadow-[0_6px_0_0_rgba(20,83,45,1)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(20,83,45,1)]',
    pink: 'bg-pink-400 border-pink-600 hover:bg-pink-500 shadow-[0_6px_0_0_rgba(131,24,67,1)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(131,24,67,1)]',
    yellow: 'bg-yellow-400 border-yellow-600 hover:bg-yellow-500 shadow-[0_6px_0_0_rgba(133,77,14,1)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(133,77,14,1)]',
    red: 'bg-red-400 border-red-600 hover:bg-red-500 shadow-[0_6px_0_0_rgba(127,29,29,1)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(127,29,29,1)]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xl',
    md: 'px-8 py-4 text-2xl',
    lg: 'px-12 py-6 text-4xl',
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        inline-flex items-center justify-center
        rounded-3xl border-b-8 text-white font-bold
        transition-all duration-150 transform
        select-none
      `}
    >
      {children}
    </button>
  );
};

export default KidButton;
