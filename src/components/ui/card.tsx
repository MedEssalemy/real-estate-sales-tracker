interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        className || ''
      }`}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  description?: string
  className?: string
}

export function CardHeader({ title, description, className }: CardHeaderProps) {
  return (
    <div className={`p-4 border-b border-gray-200 ${className || ''}`}>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`p-4 ${className || ''}`}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div
      className={`p-4 border-t border-gray-200 bg-gray-50 ${className || ''}`}
    >
      {children}
    </div>
  )
}
