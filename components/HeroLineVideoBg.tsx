"use client";

import { useEffect, useRef } from "react";

export default function HeroLineVideoBg() {
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
    video.src = "/pets-horizontal-2.mp4";
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

    const getCoverSize = (
      videoWidth: number,
      videoHeight: number,
      canvasWidth: number,
      canvasHeight: number,
    ) => {
      const videoRatio = videoWidth / videoHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;

      if (videoRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * videoRatio;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / videoRatio;
      }

      const x = canvasWidth / 2 - drawWidth / 2;
      const y = canvasHeight / 2 - drawHeight / 2;

      return { x, y, drawWidth, drawHeight };
    };

    const isVisiblePixel = (r: number, g: number, b: number) => {
      const brightness = (r + g + b) / 3;

      // Tar mørke områder + medium kontrast fra videoen
      return brightness < 185;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      // Bakgrunnsfarge fra heroen din
      ctx.fillStyle = "#dddad5";
      ctx.fillRect(0, 0, width, height);

      if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      bctx.clearRect(0, 0, width, height);
      bctx.fillStyle = "#ffffff";
      bctx.fillRect(0, 0, width, height);

      const { x, y, drawWidth, drawHeight } = getCoverSize(
        video.videoWidth,
        video.videoHeight,
        width,
        height,
      );

      bctx.drawImage(video, x, y, drawWidth, drawHeight);

      const pixels = bctx.getImageData(0, 0, width, height).data;

      const lineGap = 4;
      const lineWidth = 2;
      const sampleStep = 2;

      ctx.fillStyle = "#000000";
      ctx.globalAlpha = 0.7;

      for (let x = 0; x < width; x += lineGap) {
        let startY: number | null = null;

        const wobble = Math.sin(time * 1.5 + x * 0.025) * 0.8;

        for (let y = 0; y < height; y += sampleStep) {
          const sampleX = Math.max(
            0,
            Math.min(width - 1, Math.floor(x + wobble)),
          );

          const sampleY = Math.max(0, Math.min(height - 1, y));
          const index = (sampleY * width + sampleX) * 4;

          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];

          const visible = isVisiblePixel(r, g, b);

          if (visible && startY === null) {
            startY = y;
          }

          if ((!visible || y >= height - sampleStep) && startY !== null) {
            const segmentHeight = y - startY;

            if (segmentHeight > 4) {
              ctx.fillRect(x, startY, lineWidth, segmentHeight);
            }

            startY = null;
          }
        }
      }

      ctx.globalAlpha = 1;

      // Soft overlay så teksten fortsatt er lesbar
      ctx.fillStyle = "rgba(221, 218, 213, 0.35)";
      ctx.fillRect(0, 0, width, height);

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
