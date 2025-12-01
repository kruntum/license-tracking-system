'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
    try {
        const { theme, toggleTheme } = useTheme();

        return (
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                    <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                )}
            </button>
        );
    } catch (error) {
        // Fallback if ThemeProvider is not available
        return (
            <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
            >
                <Sun size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
        );
    }
}
