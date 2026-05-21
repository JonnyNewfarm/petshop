"use client";

import { useEffect, useRef } from "react";

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

    const video = document.createElement("video");
    video.src = "/dog-10.mp4";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d", {
      willReadFrequently: true,
    });

    if (!bctx) return;

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

    const isDogPixel = (r: number, g: number, b: number) => {
      const brightness = (r + g + b) / 3;

      // Golden / brown dog
      const brownDog =
        r > 45 &&
        g > 28 &&
        b < 150 &&
        r > b * 1.1 &&
        g > b * 0.8 &&
        brightness < 210;

      // Dark fur details
      const darkFur = brightness < 85;

      return brownDog || darkFur;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      // WHITE PAGE BACKGROUND
      ctx.fillStyle = "#dddad5";
      ctx.fillRect(0, 0, width, height);

      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // White buffer, so empty pixels are white, not black
      bctx.fillStyle = "#ffffff";
      bctx.fillRect(0, 0, width, height);

      const videoRatio = video.videoWidth / video.videoHeight;

      const drawHeight = Math.min(height * 0.78, 760);
      const drawWidth = drawHeight * videoRatio;

      const videoX = width / 2 - drawWidth / 2;
      const videoY = height / 2 - drawHeight / 2 + 30;

      const videoLeft = videoX;
      const videoRight = videoX + drawWidth;
      const videoTop = videoY;
      const videoBottom = videoY + drawHeight;

      bctx.drawImage(video, videoX, videoY, drawWidth, drawHeight);

      const pixels = bctx.getImageData(0, 0, width, height).data;

      const lineGap = 3.5;
      const lineWidth = 2;
      const sampleStep = 2;

      // BLACK DOG LINES
      ctx.fillStyle = "#000000";
      ctx.globalAlpha = 1;

      for (let x = 0; x < width; x += lineGap) {
        let startY: number | null = null;

        // tiny movement so the lines feel alive
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

          const dog = isDogPixel(r, g, b);

          if (dog && startY === null) {
            startY = y;
          }

          if ((!dog || y >= height - sampleStep) && startY !== null) {
            const segmentHeight = y - startY;

            if (segmentHeight > 4) {
              ctx.fillRect(x, startY, lineWidth, segmentHeight);
            }

            startY = null;
          }
        }
      }

      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();

    const start = () => {
      video.play().catch(() => {});
      draw();
    };

    video.addEventListener("loadeddata", start);
    video.load();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      video.removeEventListener("loadeddata", start);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      video.pause();
      video.src = "";
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
