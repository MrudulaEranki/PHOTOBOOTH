import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER = import.meta.env.VITE_SERVER_URL;

export function useRoom() {
  const [roomId, setRoomId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | creating | joined | full | error
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SERVER);
    return () => socketRef.current.disconnect();
  }, []);

  async function createRoom() {
    setStatus('creating');
    const loc = await getLocation();
    const res = await fetch(`${SERVER}/room/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: loc }),
    });
    const { roomId } = await res.json();
    setRoomId(roomId);
    setStatus('joined');
    return roomId;
  }

  async function joinRoom(id) {
    const res = await fetch(`${SERVER}/room/${id}`);
    if (!res.ok) {
      const { error } = await res.json();
      setStatus(error === 'Room is full' ? 'full' : 'error');
      return null;
    }
    setRoomId(id);
    setStatus('joined');
    return id;
  }

  return { roomId, status, socket: socketRef.current, createRoom, joinRoom };
}

async function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null)
    );
  });
}