import { ButtonHTMLAttributes } from 'react';
import { SpinnerIcon } from '../icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'ghost' | 'outline' | 'rose';
  loading?: boolean;
}

const variants = {
  primary: 'bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-300',
  gold: 'bg-gold-500 text-blue-900 hover:bg-gold-600 disabled:bg-gold-100',
  ghost: 'bg-transparent text-blue-700 hover:bg-blue-50 disabled:text-blue-300',
  outline: 'border border-blue-300 bg-transparent text-blue-700 hover:bg-blue-50 disabled:text-blue-300',
  rose: 'bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-300',
};

export function Button({ variant = 'primary', loading, disabled, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <SpinnerIcon />}
      {children}
    </button>
  );
}
