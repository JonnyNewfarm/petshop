"use client";

export default function PetVideoBg() {
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
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="
            absolute left-1/2 top-1/2
            h-[103%] w-[103%]
            -translate-x-1/2 -translate-y-1/2
            object-cover
          "
        >
          <source src="/pet-video-3.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
