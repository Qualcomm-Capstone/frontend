import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SpeedDistributionChartProps {
  speedData: {
    range: string;
    count: number;
    color: string;
  }[];
}

const COLORS = ['#22d3ee', '#facc15', '#fb923c', '#f87171', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{payload[0].name}</p>
      <p className="text-sm font-semibold text-white">{payload[0].value}건</p>
    </div>
  );
};

const SpeedDistributionChart: React.FC<SpeedDistributionChartProps> = ({ speedData }) => {
  const total = speedData.reduce((sum, data) => sum + data.count, 0);

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-5">속도 분포</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={speedData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="range"
              strokeWidth={0}
            >
              {speedData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {speedData.map((data, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span>{data.range}</span>
            <span className="text-gray-600">({total > 0 ? ((data.count / total) * 100).toFixed(0) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedDistributionChart;
