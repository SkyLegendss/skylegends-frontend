export default function CornerFrame({ inset = 24, className = 'border-white/25' }: { inset?: number; className?: string }) {
  const corner = `absolute w-7 h-7 ${className}`;
  return (
    <div className="pointer-events-none absolute z-10" style={{ inset }}>
      <div className="relative w-full h-full">
        <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
        <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
      </div>
    </div>
  );
}
