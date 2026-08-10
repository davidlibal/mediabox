export function FormatSelector({
  formats,
  selected,
  onSelect,
  disabled,
}: {
  formats: string[];
  selected: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Formato">
      {formats.map((format, index) => (
        <button
          key={format}
          type="button"
          role="radio"
          aria-checked={selected === index}
          onClick={() => onSelect(index)}
          disabled={disabled}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
            selected === index
              ? "border-accent/60 bg-accent-muted text-accent"
              : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
          }`}
        >
          {format}
        </button>
      ))}
    </div>
  );
}
