export function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index === current ? 'w-8 bg-emerald-600' : index < current ? 'w-4 bg-emerald-300' : 'w-4 bg-emerald-100'
          }`}
        />
      ))}
    </div>
  );
}
