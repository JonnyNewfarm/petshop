"use client";

export default function PetVideoBg() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#dddad5]">
      <div className="absolute inset-0 overflow-hidden bg-[#dddad5]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="
            absolute left-1/2 top-1/2
            h-[102%] w-[102%]
            -translate-x-1/2 -translate-y-1/2
            object-fill
          "
        >
          <source src="/pet-line-desktop.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
