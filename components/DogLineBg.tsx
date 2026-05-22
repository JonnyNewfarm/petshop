"use client";

import { useEffect, useRef } from "react";

type AnimalVideo = {
  src: string;
  xOffset: number;
  yOffset: number;
  scale: number;
};

export default function DogLineBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d", {
      willReadFrequently: true,
    });

    if (!bctx) return;

    const createVideo = (src: string) => {
      const video = document.createElement("video");

      video.src = src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;

      return video;
    };

    const dogVideo = createVideo("/dog-10.mp4");
    const catVideo = createVideo("/cat-10.mp4");

    const animals: AnimalVideo[] = [
      {
        src: "/cat-10.mp4",
        xOffset: -130,
        yOffset: 20,
        scale: 0.3,
      },
      {
        src: "/dog-10.mp4",
        xOffset: 40,
        yOffset: 30,
        scale: 0.78,
      },
    ];

    const videos = {
      "/dog-10.mp4": dogVideo,
      "/cat-10.mp4": catVideo,
    };

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      buffer.width = width;
      buffer.height = height;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isAnimalPixel = (r: number, g: number, b: number) => {
      const brightness = (r + g + b) / 3;

      const brownFur =
        r > 45 &&
        g > 28 &&
        b < 155 &&
        r > b * 1.08 &&
        g > b * 0.75 &&
        brightness < 220;

      const darkFur = brightness < 92;

      return brownFur || darkFur;
    };

    const drawAnimal = (video: HTMLVideoElement, animal: AnimalVideo) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        return;
      }

      bctx.fillStyle = "#ffffff";
      bctx.fillRect(0, 0, width, height);

      const videoRatio = video.videoWidth / video.videoHeight;

      const baseHeight = Math.min(height * animal.scale, 760);
      const drawHeight = baseHeight;
      const drawWidth = drawHeight * videoRatio;

      const videoX = width / 2 - drawWidth / 2 + animal.xOffset;
      const videoY = height / 2 - drawHeight / 2 + animal.yOffset;

      const videoLeft = videoX;
      const videoRight = videoX + drawWidth;
      const videoTop = videoY;
      const videoBottom = videoY + drawHeight;

      bctx.drawImage(video, videoX, videoY, drawWidth, drawHeight);

      const pixels = bctx.getImageData(0, 0, width, height).data;

      const lineGap = 3.5;
      const lineWidth = 2;
      const sampleStep = 2;

      ctx.fillStyle = "#000000";
      ctx.globalAlpha = 0.5;

      for (let x = 0; x < width; x += lineGap) {
        let startY: number | null = null;

        const wobble = Math.sin(time * 1.5 + x * 0.025) * 0.8;

        for (let y = 0; y < height; y += sampleStep) {
          const sampleX = Math.max(
            0,
            Math.min(width - 1, Math.floor(x + wobble)),
          );

          const sampleY = Math.max(0, Math.min(height - 1, y));

          const insideVideo =
            sampleX >= videoLeft &&
            sampleX <= videoRight &&
            sampleY >= videoTop &&
            sampleY <= videoBottom;

          if (!insideVideo) {
            if (startY !== null) {
              const segmentHeight = y - startY;

              if (segmentHeight > 4) {
                ctx.fillRect(x, startY, lineWidth, segmentHeight);
              }

              startY = null;
            }

            continue;
          }

          const index = (sampleY * width + sampleX) * 4;

          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];

          const animalPixel = isAnimalPixel(r, g, b);

          if (animalPixel && startY === null) {
            startY = y;
          }

          if ((!animalPixel || y >= height - sampleStep) && startY !== null) {
            const segmentHeight = y - startY;

            if (segmentHeight > 4) {
              ctx.fillRect(x, startY, lineWidth, segmentHeight);
            }

            startY = null;
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#dddad5";
      ctx.fillRect(0, 0, width, height);

      animals.forEach((animal) => {
        const video = videos[animal.src as keyof typeof videos];
        drawAnimal(video, animal);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();

    const start = () => {
      dogVideo.play().catch(() => {});
      catVideo.play().catch(() => {});
      draw();
    };

    dogVideo.addEventListener("loadeddata", start);
    catVideo.addEventListener("loadeddata", start);

    dogVideo.load();
    catVideo.load();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      dogVideo.removeEventListener("loadeddata", start);
      catVideo.removeEventListener("loadeddata", start);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      dogVideo.pause();
      catVideo.pause();

      dogVideo.src = "";
      catVideo.src = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
