import React from 'react';
import StatsCard from './StatsCard';
import ViolationsTable from './ViolationsTable';
import TrendChart from './TrendChart';
import LaneViolationChart from './LaneViolationChart';
import SpeedDistributionChart from './SpeedDistributionChart';
import { Violation, StatsData } from '../types';
import { extractLaneStats, extractSpeedDistribution } from '../utils/helpers';
import { AlertTriangle, CheckCircle, Clock, Gauge } from 'lucide-react';

interface DashboardProps {
  violations: Violation[];
  stats: StatsData;
  onSelectViolation: (violation: Violation) => void;
  onDeleteViolation: (id: number) => void;
  selectedViolationId?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  violations,
  stats,
  onSelectViolation,
  onDeleteViolation,
  selectedViolationId
}) => {
  const laneData = extractLaneStats(violations);
  const speedData = extractSpeedDistribution(violations);

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="총 위반"
          value={stats.totalViolations}
          icon={<AlertTriangle className="w-5 h-5 text-cyan-400" />}
        />
        <StatsCard
          title="확인 완료"
          value={stats.checked}
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
        />
        <StatsCard
          title="미확인"
          value={stats.pendingReview}
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
        />
        <StatsCard
          title="평균 속도"
          value={`${stats.avgSpeed || 0} km/h`}
          icon={<Gauge className="w-5 h-5 text-red-400" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart violations={violations} />
        </div>
        <div>
          <SpeedDistributionChart speedData={speedData} />
        </div>
      </div>

      {/* Lane Chart (if data exists) */}
      {laneData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <LaneViolationChart laneData={laneData} />
          </div>
          <div className="lg:col-span-2">
            <ViolationsTable
              violations={violations}
              onSelectViolation={onSelectViolation}
              onDeleteViolation={onDeleteViolation}
              selectedViolationId={selectedViolationId}
            />
          </div>
        </div>
      )}

      {/* Table (if no lane data, show full width) */}
      {laneData.length === 0 && (
        <ViolationsTable
          violations={violations}
          onSelectViolation={onSelectViolation}
          onDeleteViolation={onDeleteViolation}
          selectedViolationId={selectedViolationId}
        />
      )}
    </div>
  );
};

export default Dashboard;
