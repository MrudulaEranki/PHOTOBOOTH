import { useState } from 'react';

export default function RoomControls({ onCreate, onJoin, roomId, status }) {
  const [inputId, setInputId] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      {/* Create button */}
      <button
        onClick={onCreate}
        className="px-5 py-2 bg-white hover:bg-white/90 text-black text-sm font-bold uppercase tracking-widest rounded-none transition"
      >
        + Create Room
      </button>

      {/* Join — toggle on mobile */}
      <div className="flex gap-2">
        <input
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          onFocus={() => setShowJoin(true)}
          placeholder="Room ID"
          className="flex-1 sm:w-36 px-3 py-2 bg-transparent text-white text-sm placeholder-white/30 border border-white/20 focus:border-white/60 focus:outline-none rounded-none transition"
        />
        <button
          onClick={() => onJoin(inputId)}
          className="px-4 py-2 border border-white/30 hover:border-white text-white text-sm font-bold uppercase tracking-widest rounded-none transition"
        >
          Join
        </button>
      </div>

      {/* Room ID badge */}
      {roomId && (
        <div className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5">
          <span className="text-white/40 text-xs uppercase tracking-widest">Room</span>
          <span className="text-white font-mono text-sm font-bold">{roomId}</span>
        </div>
      )}

      {/* Status messages */}
      {status === 'full' && (
        <p className="text-white/50 text-xs uppercase tracking-widest">Room is full</p>
      )}
      {status === 'error' && (
        <p className="text-white/50 text-xs uppercase tracking-widest">Room not found</p>
      )}
    </div>
  );
}