export function Button({ children, type = "button", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
