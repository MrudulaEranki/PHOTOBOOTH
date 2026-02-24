import { downloadPNG, downloadJPEG, downloadPDF } from '../utils/export';

export default function Controls({ onCapture, photoCount, allDone, photos, layout }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      {!allDone && (
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-white hover:bg-pink-100 border-4 border-pink-400 transition flex items-center justify-center shadow-lg"
          title="Take photo"
        >
          <span className="text-2xl">📸</span>
        </button>
      )}

      <p className="text-white/60 text-sm">{photoCount} / 4 taken</p>

      {allDone && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => downloadPNG(photos, layout)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition"
          >
            PNG
          </button>
          <button
            onClick={() => downloadJPEG(photos, layout)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
          >
            JPEG
          </button>
          <button
            onClick={() => downloadPDF(photos, layout)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition"
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );
}