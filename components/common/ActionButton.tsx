
import React from 'react';

interface ActionButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled = false, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 text-lg font-semibold text-white bg-ion-blue rounded-md shadow-md hover:bg-ion-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ion-blue transition-colors duration-300 disabled:bg-ion-gray-dark disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
