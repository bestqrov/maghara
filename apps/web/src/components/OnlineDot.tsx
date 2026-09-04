export function OnlineDot({ className = 'h-3 w-3' }: { className?: string }) {
  return <span className={`absolute rounded-full border-2 border-surface bg-emerald-500 ${className}`} aria-hidden="true" />;
}
