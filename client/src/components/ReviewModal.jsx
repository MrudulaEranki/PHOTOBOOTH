export default function ReviewModal({ photo, onConfirm, onRetake }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
        <h2 className="text-white text-lg font-bold">Review Photo</h2>
        <img src={photo} alt="captured" className="rounded-lg w-full" />
        <div className="flex gap-4 w-full">
          <button
            onClick={onRetake}
            className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
          >
            Retake
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition"
          >
            Keep it!
          </button>
        </div>
      </div>
    </div>
  );
}