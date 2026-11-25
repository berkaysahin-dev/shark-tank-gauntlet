export function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30 transition-opacity"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(41, 151, 255, 0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
