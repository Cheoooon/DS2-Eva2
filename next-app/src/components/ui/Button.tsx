export function Button({ children, type = "button", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
