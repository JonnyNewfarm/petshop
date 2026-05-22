"use client";

export default function PetVideoBg() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#dddad5]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="
          absolute left-1/2 top-1/2
          h-full w-full
          -translate-x-1/2 -translate-y-1/2
          object-cover
          scale-[1.01]
        "
      >
        <source src="/pet-video.mkv" type="video/mp4" />
      </video>
    </div>
  );
}
