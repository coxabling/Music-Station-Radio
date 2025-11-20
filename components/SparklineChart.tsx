import React from 'react';

interface SparklineChartProps {
  data: number[];
  color?: string; // 'green', 'red', or a hex color
  width?: number;
  height?: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = 'currentColor', // Default to current text color
  width = 60,
  height = 30,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center text-gray-500 text-xs">No data</div>;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);

  // Normalize data to fit SVG viewBox (0 to height, inverted for y-axis)
  const normalizedData = data.map(value =>
    min === max ? height / 2 : height - ((value - min) / (max - min)) * height
  );

  const points = normalizedData
    .map((y, i) => `${(i / (data.length - 1)) * width},${y}`)
    .join(' ');

  let strokeColor = color;
  if (color === 'green') strokeColor = '#22c55e'; // Tailwind green-500
  if (color === 'red') strokeColor = '#ef4444';   // Tailwind red-500

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        points={points}
      />
    </svg>
  );
};