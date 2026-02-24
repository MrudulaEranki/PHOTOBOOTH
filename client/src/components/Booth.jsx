import { useState, useRef } from 'react';
import Camera from './Camera';
import Controls from './Controls';
import FramePicker from './FramePicker';
import PhotoStrip from './PhotoStrip';
import ReviewModal from './ReviewModal';
import { usePeer } from '../hooks/usePeer';

export default function Booth({ roomId, socket }) {
  const [photos, setPhotos] = useState([]);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [layout, setLayout] = useState('vertical');
  const videoRef = useRef(null);

  const { localStream, remoteStream, sendPhoto, sendRetake } = usePeer({
    roomId,
    socket,
    onPhotoReceived: (photoData, index) => {
      setPhotos(prev => {
        const next = [...prev];
        next[index] = photoData;
        return next;
      });
    },
    onRetake: (index) => {
      setPhotos(prev => {
        const next = [...prev];
        next[index] = undefined;
        return next;
      });
    },
  });

  function capture() {
    if (!videoRef.current || photos.length >= 4) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPendingPhoto(dataUrl);
  }

  function confirmPhoto() {
    const index = photos.length;
    const next = [...photos, pendingPhoto];
    setPhotos(next);
    sendPhoto(pendingPhoto, index);
    setPendingPhoto(null);
  }

  function retakePhoto() {
    sendRetake(photos.length);
    setPendingPhoto(null);
  }

  const allDone = photos.filter(Boolean).length === 4;

  return (
    <div className="flex gap-6 items-start justify-center w-full">
      {/* Live cameras */}
      <div className="flex flex-col gap-3 flex-1">
        <Camera stream={localStream} muted={true} label="You" ref={videoRef} />
        {remoteStream && <Camera stream={remoteStream} label="Friend" />}
      </div>

      {/* Strip preview + controls */}
      <div className="flex flex-col gap-4 items-center">
        <PhotoStrip photos={photos} layout={layout} />
        <FramePicker layout={layout} onChange={setLayout} />
        <Controls
          onCapture={capture}
          photoCount={photos.filter(Boolean).length}
          allDone={allDone}
          photos={photos}
          layout={layout}
        />
      </div>

      {pendingPhoto && (
        <ReviewModal
          photo={pendingPhoto}
          onConfirm={confirmPhoto}
          onRetake={retakePhoto}
        />
      )}
    </div>
  );
}