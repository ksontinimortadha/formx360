import React, { useRef, useEffect } from "react";

function PieChart({ data }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = ["#007bff", "#ff6384", "#ffc107", "#28a745", "#6f42c1"];
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Draw labels
    startAngle = 0;
    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const angle = startAngle + sliceAngle / 2;
      const x = 150 + Math.cos(angle) * 120;
      const y = 150 + Math.sin(angle) * 120;
      ctx.fillStyle = "#000";
      ctx.font = "14px sans-serif";
      ctx.fillText(`${d.label} (${d.value})`, x - 30, y);
      startAngle += sliceAngle;
    });
  }, [data]);

  return <canvas ref={canvasRef} width={300} height={300} />;
}

export default PieChart;
