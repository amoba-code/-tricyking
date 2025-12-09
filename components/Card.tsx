import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ 
  children, 
  className = '',
  title
}) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl ${className}`}>
      {title && <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{title}</h3>}
      {children}
    </div>
  );
};