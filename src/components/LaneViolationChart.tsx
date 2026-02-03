import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LaneViolationChartProps {
  laneData: {
    lane: number;
    count: number;
    avgSpeed: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}차선</p>
      <p className="text-sm font-semibold text-cyan-400">{payload[0].value}건</p>
    </div>
  );
};

const LaneViolationChart: React.FC<LaneViolationChartProps> = ({ laneData }) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-white mb-5">차선별 위반 현황</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={laneData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="lane"
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}차선`}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.05)' }} />
            <Bar
              dataKey="count"
              fill="url(#cyanGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LaneViolationChart;
