"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = [
  "rgba(59, 130, 246, 0.5)",
  "rgba(99, 102, 241, 0.4)",
  "rgba(37, 99, 235, 0.45)",
];

export function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initBlobs = () => {
      const blobs: Blob[] = [];
      const blobCount = 3;

      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.min(canvas.width, canvas.height) * (0.3 + Math.random() * 0.2),
          color: COLORS[i % COLORS.length],
        });
      }

      blobsRef.current = blobs;
    };

    const drawBlob = (blob: Blob, time: number) => {
      if (!ctx) return;

      const { x, y, radius, color } = blob;

      const wobble1 = Math.sin(time * 0.001 + blob.x * 0.01) * 20;
      const wobble2 = Math.cos(time * 0.0015 + blob.y * 0.01) * 15;

      const gradient = ctx.createRadialGradient(
        x + wobble1,
        y + wobble2,
        0,
        x + wobble1,
        y + wobble2,
        radius
      );

      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, "0.2)"));
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(x + wobble1, y + wobble2, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const updateBlob = (blob: Blob) => {
      blob.x += blob.vx;
      blob.y += blob.vy;

      const padding = blob.radius * 0.5;

      if (blob.x < -padding) blob.x = canvas.width + padding;
      if (blob.x > canvas.width + padding) blob.x = -padding;
      if (blob.y < -padding) blob.y = canvas.height + padding;
      if (blob.y > canvas.height + padding) blob.y = -padding;
    };

    const animate = (time: number) => {
      ctx.fillStyle = "rgb(2, 6, 23)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";

      for (const blob of blobsRef.current) {
        updateBlob(blob);
        drawBlob(blob, time);
      }

      ctx.globalCompositeOperation = "source-over";

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initBlobs();
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      initBlobs();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: "rgb(2, 6, 23)" }}
    />
  );
}
