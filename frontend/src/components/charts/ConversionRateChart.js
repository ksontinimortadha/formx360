import React, { useRef, useEffect } from "react";

function ConversionRateChart({ stages, counts }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 60;

    ctx.clearRect(0, 0, width, height);

    // Colors & fonts
    const bgColor = "#f8f9fa";
    const axisColor = "#d1d1d6";
    const barColor = "#0a84ff";
    const textColor = "#1c1c1e";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Scale bars
    const maxCount = Math.max(...counts, 1);
    const barWidth = (width - padding * 2) / stages.length / 1.5;
    const gap = barWidth / 2;

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding / 2);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding / 2, height - padding);
    ctx.stroke();

    ctx.fillStyle = barColor;
    ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";

    const firstCount = counts[0] || 1;

    counts.forEach((count, i) => {
      const barHeight = (count / maxCount) * (height - padding * 2);
      const x = padding + i * (barWidth + gap) + gap / 2;
      const y = height - padding - barHeight;

      // Bar
      ctx.fillRect(x, y, barWidth, barHeight);

      // Stage label below
      ctx.fillStyle = textColor;
      ctx.textBaseline = "top";
      ctx.fillText(stages[i], x + barWidth / 2, height - padding + 10);

      // Conversion %
      ctx.fillStyle = barColor;
      ctx.textBaseline = "bottom";
      const conversionRate = ((count / firstCount) * 100).toFixed(1) + "%";
      ctx.fillText(conversionRate, x + barWidth / 2, y - 5);

      ctx.fillStyle = barColor;
      ctx.textBaseline = "bottom";
    });

    // Y axis counts
    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - ((height - padding * 2) / 5) * i;
      const val = Math.round((maxCount / 5) * i);
      ctx.fillText(val, padding - 10, y);
    }
  }, [stages, counts]);

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

export default ConversionRateChart;
