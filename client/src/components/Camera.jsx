import { useEffect, useRef, forwardRef } from 'react';

const Camera = forwardRef(function Camera({ stream, muted = false, label }, ref) {
  const internalRef = useRef(null);
  const videoRef = ref || internalRef;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="w-full h-full object-cover"
      />
      {label && (
        <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
          {label}
        </span>
      )}
    </div>
  );
});

export default Camera;