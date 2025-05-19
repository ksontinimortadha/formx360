import React, { useRef, useEffect } from "react";

function LineChart({ labels, data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Theme colors
    const bgColor = "#f8f9fa";
    const axisColor = "#d1d1d6";
    const lineColor = "#0a84ff";
    const pointColor = "#0a84ff";
    const textColor = "#1c1c1e";

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const maxVal = Math.max(...data, 1);
    const stepX = (width - padding * 2) / (labels.length - 1 || 1);
    const points = data.map((value, index) => ({
      x: padding + index * stepX,
      y: height - padding - (value / maxVal) * (height - padding * 2),
    }));

    // Draw axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding / 2);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding / 2, height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = pointColor;
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelStep = Math.ceil(labels.length / 6);
    labels.forEach((label, i) => {
      if (i % labelStep === 0 || i === labels.length - 1) {
        const shortLabel = label.slice(5);
        ctx.fillText(shortLabel, padding + i * stepX, height - padding + 10);
      }
    });

    // Y-axis labels
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

export default LineChart;
