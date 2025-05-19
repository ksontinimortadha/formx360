import React, { useRef, useEffect } from "react";

function RadarChart({ data }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 300;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    const count = data.length;
    const angleStep = (2 * Math.PI) / count;

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = "#ccc";
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw outer polygon
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const value = data[i].normalizedValue; // should be between 0-1
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#007bff";
    ctx.fillStyle = "rgba(0, 123, 255, 0.3)";
    ctx.fill();
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    data.forEach((d, i) => {
      const angle = i * angleStep;
      const x = centerX + (radius + 15) * Math.cos(angle);
      const y = centerY + (radius + 15) * Math.sin(angle);
      ctx.fillText(d.label, x - 20, y);
    });
  }, [data]);

  return <canvas ref={canvasRef} width={300} height={300} />;
}

export default RadarChart;
