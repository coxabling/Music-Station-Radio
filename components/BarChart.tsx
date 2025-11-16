import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <h3 className="font-bold text-gray-300 mb-3">{title}</h3>
        <div className="bg-gray-900/50 p-4 rounded-lg text-center text-sm text-gray-500">
          Not enough listening data yet.
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div>
      <h3 className="font-bold text-gray-300 mb-3">{title}</h3>
      <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg">
        {data.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-20 truncate" title={label}>{label}</span>
            <div className="flex-grow bg-gray-700/50 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-[var(--accent-color)] to-purple-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
