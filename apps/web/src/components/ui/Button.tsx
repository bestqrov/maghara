import { ButtonHTMLAttributes } from 'react';
import { SpinnerIcon } from '../icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'ghost';
  loading?: boolean;
}

const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300',
  gold: 'bg-gold-500 text-emerald-900 hover:bg-gold-600 disabled:bg-gold-100',
  ghost: 'bg-transparent text-emerald-700 hover:bg-emerald-50 disabled:text-emerald-300',
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
