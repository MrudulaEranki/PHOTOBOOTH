import { useRoom } from './hooks/useRoom';
import RoomControls from './components/RoomControls';
import Booth from './components/Booth';

export default function App() {
  const { roomId, status, socket, createRoom, joinRoom } = useRoom();

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      
      {/* Header bar — fixed height */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 px-4 sm:px-6 py-3 shrink-0">
        <h1 className="text-white font-bold text-xl sm:text-2xl tracking-widest uppercase mr-auto">
          ◻ Photobooth
        </h1>
        <RoomControls
          onCreate={createRoom}
          onJoin={joinRoom}
          roomId={roomId}
          status={status}
        />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 shrink-0" />

      {/* Main area — takes all remaining height */}
      <div className="flex-1 min-h-0 p-3 sm:p-5">
        {roomId && socket ? (
          <Booth roomId={roomId} socket={socket} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
              <span className="text-2xl">◻</span>
            </div>
            <p className="text-white/20 text-base sm:text-xl text-center px-4">
              Create or join a room to start your photobooth session
            </p>
          </div>
        )}
      </div>

    </div>
  );
}