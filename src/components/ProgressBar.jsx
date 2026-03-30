export function ProgressBar({ value, max, color, width = 50, height = 4 }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      style={{
        width,
        height,
        background: "#f3f4f6",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color || "var(--color-accent)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}
