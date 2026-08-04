export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
      {...props}
    />
  )
}
