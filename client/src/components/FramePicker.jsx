export default function FramePicker({ layout, onChange }) {
  return (
    <div className="flex gap-3 items-center">
      <span className="text-white/60 text-sm">Frame:</span>
      <button
        onClick={() => onChange('vertical')}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${
          layout === 'vertical'
            ? 'bg-pink-500 border-pink-500 text-white'
            : 'border-white/20 text-white/60 hover:border-white/40'
        }`}
      >
        4×1 Strip
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${
          layout === 'grid'
            ? 'bg-pink-500 border-pink-500 text-white'
            : 'border-white/20 text-white/60 hover:border-white/40'
        }`}
      >
        2×2 Grid
      </button>
    </div>
  );
}