type Inset = { top?: number; right?: number; bottom?: number; left?: number };

export default function CornerFrame({
  inset = { top: 96, right: 24, bottom: 24, left: 24 },
  className = 'border-white/40',
  size = 36,
}: { inset?: Inset; className?: string; size?: number }) {
  const corner = `absolute ${className}`;
  const style = { width: size, height: size };
  return (
    <div className="pointer-events-none absolute z-10" style={{ ...inset }}>
      <div className="relative w-full h-full">
        <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} style={style} />
        <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} style={style} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} style={style} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} style={style} />
      </div>
    </div>
  );
}
