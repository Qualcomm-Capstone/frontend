import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Violation } from '../types';

interface TrendChartProps {
  violations: Violation[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-cyan-400">{payload[0].value}건</p>
      {payload[1] && (
        <p className="text-xs text-gray-400 mt-0.5">평균 {payload[1].value} km/h</p>
      )}
    </div>
  );
};

const TrendChart: React.FC<TrendChartProps> = ({ violations }) => {
  const [mode, setMode] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyData = useMemo(() => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      const dayViolations = violations.filter(v => {
        if (!v.detected_at) return false;
        const vDate = new Date(v.detected_at);
        return vDate >= dayStart && vDate < dayEnd;
      });
      const avgSpeed = dayViolations.length > 0
        ? Math.round(dayViolations.reduce((s, v) => s + v.detected_speed, 0) / dayViolations.length)
        : 0;

      result.push({
        name: `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`,
        count: dayViolations.length,
        avgSpeed,
      });
    }
    return result;
  }, [violations]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekViolations = violations.filter(v => {
        if (!v.detected_at) return false;
        const vDate = new Date(v.detected_at);
        return vDate >= weekStart && vDate <= weekEnd;
      });
      const avgSpeed = weekViolations.length > 0
        ? Math.round(weekViolations.reduce((s, v) => s + v.detected_speed, 0) / weekViolations.length)
        : 0;

      result.push({
        name: `${weekStart.getMonth() + 1}/${weekStart.getDate()} ~ ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`,
        count: weekViolations.length,
        avgSpeed,
      });
    }
    return result;
  }, [violations]);

  const data = mode === 'weekly' ? weeklyData : monthlyData;
  const totalCount = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {mode === 'weekly' ? '주간' : '월간'} 위반 추이
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            총 <span className="text-cyan-400 font-medium">{totalCount}</span>건
          </p>
        </div>
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => setMode('weekly')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'weekly'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setMode('monthly')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'monthly'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            월간
          </button>
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'weekly' ? (
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.15)"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.15)"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={{ fill: '#22d3ee', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#22d3ee', stroke: '#06080f', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.15)"
                tick={{ fill: '#6b7280', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.15)"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="url(#monthlyGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <defs>
                <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
