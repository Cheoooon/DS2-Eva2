export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white p-6 border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}
