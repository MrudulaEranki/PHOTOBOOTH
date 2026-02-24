export default function PhotoStrip({ photos, layout }) {
  const slots = Array(4).fill(null).map((_, i) => photos[i] || null);

  const containerClass = layout === 'grid'
    ? 'grid grid-cols-2 gap-1'
    : 'flex flex-col gap-1';

  return (
    <div className={`${containerClass} bg-black rounded-xl overflow-hidden`} style={{ width: 200 }}>
      {slots.map((photo, i) => (
        <div
          key={i}
          className="bg-zinc-800 flex items-center justify-center"
          style={{ height: layout === 'grid' ? 100 : 80 }}
        >
          {photo
            ? <img src={photo} alt={`shot ${i + 1}`} className="w-full h-full object-cover" />
            : <span className="text-white/20 text-xs">{i + 1}</span>
          }
        </div>
      ))}
    </div>
  );
}