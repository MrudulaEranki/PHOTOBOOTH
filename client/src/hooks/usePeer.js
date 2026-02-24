import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const SERVER = import.meta.env.VITE_SERVER_URL;
const url = new URL(SERVER_URL);

export function usePeer({ roomId, socket, onPhotoReceived, onRetake }) {
  const peerRef = useRef(null);
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localStreamRef = useRef(null);
  const connRef = useRef(null); // data connection

  useEffect(() => {
    if (!roomId || !socket) return;

    // Get camera + mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStreamRef.current = stream;


      const peer = new Peer({
        host: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: '/peerjs',
        secure: url.protocol === 'https:',
      });

      peerRef.current = peer;

      peer.on('open', (id) => {
        setPeerId(id);
        socket.emit('join-room', { roomId, peerId: id });
      });

      // Incoming call from the other peer
      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStr) => setRemoteStream(remoteStr));
      });

      // Incoming data connection
      peer.on('connection', (conn) => {
        connRef.current = conn;
        setupDataConn(conn);
      });

      // When we learn someone joined, we call them and open data channel
      socket.on('peer-joined', ({ peerId: remotePeerId }) => {
        const call = peer.call(remotePeerId, stream);
        call.on('stream', (remoteStr) => setRemoteStream(remoteStr));

        const conn = peer.connect(remotePeerId);
        connRef.current = conn;
        setupDataConn(conn);
      });

      socket.on('peer-left', () => {
        setRemoteStream(null);
      });
    });

    return () => {
      peerRef.current?.destroy();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [roomId, socket]);

  function setupDataConn(conn) {
    conn.on('data', (data) => {
      if (data.type === 'photo') onPhotoReceived(data.photoData, data.index);
      if (data.type === 'retake') onRetake(data.index);
    });
  }

  function sendPhoto(photoData, index) {
    connRef.current?.send({ type: 'photo', photoData, index });
  }

  function sendRetake(index) {
    connRef.current?.send({ type: 'retake', index });
  }

  return { peerId, localStream: localStreamRef.current, remoteStream, sendPhoto, sendRetake };
}