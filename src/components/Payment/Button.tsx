// Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
};

export const Button = ({
    children,
    variant = 'primary',
    className,
    onClick,
    disabled = false,
    type = 'button',
}: ButtonProps) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all';
    const variantStyles = {
        primary: 'bg-orange-500 text-white hover:bg-orange-600',
        secondary: 'bg-gray-200 text-black hover:bg-gray-300',
        outline: 'border border-orange-500 text-orange-500 hover:bg-orange-100',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(baseStyles, variantStyles[variant], className, {
                'opacity-50 cursor-not-allowed': disabled,
            })}
        >
            {children}
        </button>
    );
};