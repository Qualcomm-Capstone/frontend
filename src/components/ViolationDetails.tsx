import React, { useState } from 'react';
import { Violation } from '../types';
import { CalendarDays, MapPin, AlertCircle, X, Gauge } from 'lucide-react';
import { getDangerLevel } from '../utils/helpers';

interface ViolationDetailsProps {
  violation: Violation;
  onStatusChange: (id: number, checked: boolean) => void;
  onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViolationDetails: React.FC<ViolationDetailsProps> = ({ violation, onStatusChange, onClose }) => {
  const [isChecked, setIsChecked] = useState(violation.is_checked);

  const handleCheckChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    try {
      const response = await fetch(
        `${API_BASE_URL}/cars/${violation.id}/partial-update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_checked: checked }),
        }
      );
      if (!response.ok) throw new Error('Failed to update status');
      onStatusChange(violation.id, checked);
    } catch (error) {
      console.error('Error updating status:', error);
      setIsChecked(!checked);
    }
  };

  const getSpeedLevelClass = (speed: number) => {
    if (speed >= 120) return 'text-red-400';
    if (speed >= 100) return 'text-orange-400';
    return 'text-yellow-400';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const dangerLevel = getDangerLevel(violation.car_speed);

  return (
    <div className="p-5 h-full overflow-y-auto bg-[#06080f]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">위반 상세</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Image */}
      <div className="mb-5 rounded-2xl overflow-hidden h-44 border border-white/5">
        <img
          src={violation.image_url}
          alt={`Vehicle ${violation.car_number}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        {/* License Plate */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">번호판</p>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <span className="text-xl font-bold text-white tracking-wider">{violation.car_number}</span>
          </div>
        </div>

        {/* Speed */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">감지 속도</p>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <span className={`text-3xl font-bold ${getSpeedLevelClass(violation.car_speed)}`}>
              {violation.car_speed}
            </span>
            <span className="text-sm text-gray-500 ml-1">km/h</span>
          </div>
        </div>

        {/* Check toggle */}
        <div className="flex justify-between items-center rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <span className="text-sm text-white">확인 처리</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckChange}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500/30 peer-checked:after:bg-cyan-400" />
          </label>
        </div>

        {/* Fine */}
        {violation.fineAmount && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">벌금</p>
            <div className="bg-white/5 p-3 rounded-xl text-center">
              <span className="text-2xl font-bold text-white">{violation.fineAmount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">원</span>
            </div>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-gray-500 uppercase">위치</span>
            </div>
            <p className="text-sm text-white">{violation.location || 'Seoul'}</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-gray-500 uppercase">위험도</span>
            </div>
            <p className={`text-sm font-medium ${
              dangerLevel === 'High' ? 'text-red-400' :
              dangerLevel === 'Medium' ? 'text-orange-400' : 'text-yellow-400'
            }`}>
              {dangerLevel}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-gray-500 uppercase">감지 시간</span>
            </div>
            <p className="text-xs text-white">
              {violation.created_at ? formatDate(violation.created_at) : '-'}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-gray-500 uppercase">차선</span>
            </div>
            <p className="text-sm text-white">
              {violation.lane ? `${violation.lane}차선` : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetails;
