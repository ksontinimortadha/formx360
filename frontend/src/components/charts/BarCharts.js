import React, { useRef, useEffect } from "react";

function BarChart({ labels, data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Colors
    const backgroundColor = "#f8f9fa";
    const axisColor = "#d1d1d6";
    const textColor = "#1c1c1e";
    const barColor = "#0a84ff";

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const maxVal = Math.max(...data, 1);
    const barWidth = (width - padding * 2) / (labels.length * 1.5);
    const gap = barWidth / 2;

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding / 2);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding / 2, height - padding);
    ctx.stroke();

    // Bars
    data.forEach((val, i) => {
      const barHeight = (val / maxVal) * (height - padding * 2);
      const x = padding + i * (barWidth + gap) + gap / 2;
      const y = height - padding - barHeight;

      // Rounded bar
      const radius = 6;
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + barWidth, y, radius);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + barHeight, radius);
      ctx.lineTo(x + barWidth, y + barHeight);
      ctx.lineTo(x, y + barHeight);
      ctx.closePath();
      ctx.fill();
    });

    // X Labels
    ctx.fillStyle = textColor;
    ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelStep = Math.ceil(labels.length / 6);
    labels.forEach((label, i) => {
      if (i % labelStep === 0 || i === labels.length - 1) {
        const shortLabel = label.slice(5);
        const x = padding + i * (barWidth + gap) + barWidth / 2 + gap / 2;
        ctx.fillText(shortLabel, x, height - padding + 10);
      }
    });

    // Y Labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - ((height - padding * 2) / 5) * i;
      const val = Math.round((maxVal / 5) * i);
      ctx.fillText(val, padding - 10, y);
    }
  }, [labels, data]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={350}
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        background: "#f8f9fa",
      }}
    />
  );
}

export default BarChart;
