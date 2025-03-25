interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'

  // components/ui/button.tsx
  const variantClasses = {
    primary:
      'bg-[var(--primary-800)]   text-white hover:bg-[var(--primary-700)] focus:ring-primary-500',
    secondary:
      'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-400',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2.5 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
