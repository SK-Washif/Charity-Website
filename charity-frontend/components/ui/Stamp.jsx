const toneClasses = {
  ink: "border-ink text-ink",
  marigold: "border-marigold text-ink",
  stamp: "border-stamp text-stamp",
};

/**
 * The recurring "registry seal" motif — grounded in the scholarship form's
 * real printed/stamped hard-copy workflow. Used as the logo mark and as a
 * footer seal; keep usage sparse elsewhere so it stays a signature, not decoration.
 */
export default function Stamp({ size = 72, rotate = -8, tone = "ink", lines }) {
  return (
    <div
      className={`stamp ${toneClasses[tone]}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        className="stamp absolute inset-[3px] border"
        style={{ borderStyle: "solid" }}
      />
      <div className="flex flex-col items-center justify-center gap-0.5 px-2 text-center leading-tight">
        {lines.map((line, i) => (
          <span
            key={i}
            className={
              i === 0
                ? "font-display text-[11px] font-semibold uppercase tracking-wide"
                : "label-caps text-[8px]"
            }
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
