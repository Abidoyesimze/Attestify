'use client';

import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const displayName = name || alt || 'User';
  const initials = getInitials(displayName);
  const bgColor = getColorFromName(displayName);

  return (
    <div
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        font-semibold text-white bg-gray-400 overflow-hidden
        ${bgColor} ${className}
      `}
      role="img"
      aria-label={alt || displayName}
    >
      {src ? (
        <img src={src} alt={alt || displayName} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

