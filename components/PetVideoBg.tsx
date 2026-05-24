"use client";

import { useEffect, useRef, useState } from "react";

export default function PetVideoBg() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        setShowFallback(true);
      }
    };

    playVideo();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#dddad5]">
      <div
        className="
          absolute left-1/2 top-1/2
          h-[85%] w-[85%]
          -translate-x-1/2 -translate-y-1/2
          overflow-hidden
          bg-[#dddad5]
        "
      >
        {showFallback && (
          <img
            src="/pet-video-poster.jpg"
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              absolute left-1/2 top-1/2
              h-[103%] w-[103%]
              -translate-x-1/2 -translate-y-1/2
              object-cover
            "
          />
        )}

        {!showFallback && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/pet-video-poster.jpg"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            aria-hidden="true"
            tabIndex={-1}
            className="
              pointer-events-none
              absolute left-1/2 top-1/2
              h-[103%] w-[103%]
              -translate-x-1/2 -translate-y-1/2
              object-cover
            "
          >
            <source src="/pet-video-3.mp4" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
