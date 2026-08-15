export function StepIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index === current ? 'w-8 bg-rose-500' : index < current ? 'w-4 bg-rose-300' : 'w-4 bg-blue-100'
          }`}
        />
      ))}
    </div>
  );
}
