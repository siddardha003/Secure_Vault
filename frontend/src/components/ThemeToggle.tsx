'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
  ];

  return (
    <div className="flex items-center bg-[var(--muted)] rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            relative p-2 rounded-md transition-all duration-200 text-sm font-medium
            ${theme === value 
              ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm' 
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]/50'
            }
          `}
          title={`Switch to ${label.toLowerCase()} theme`}
          aria-label={`Switch to ${label.toLowerCase()} theme`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;