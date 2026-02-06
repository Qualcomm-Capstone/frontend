import React from 'react';
import { Violation } from '../types';
import { formatDate, calculateFine } from '../utils/helpers';
import { Car, Calendar, MapPin, X } from 'lucide-react';

interface VehicleHistoryProps {
  violations: Violation[];
  plateNumber: string;
  onClose: () => void;
}

const VehicleHistory: React.FC<VehicleHistoryProps> = ({ violations, plateNumber, onClose }) => {
  const totalFines = violations.reduce((sum, v) => sum + calculateFine(v.detected_speed, v.speed_limit), 0);
  const avgSpeed = violations.length > 0
    ? Math.round(violations.reduce((sum, v) => sum + v.detected_speed, 0) / violations.length)
    : 0;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white">차량 위반 이력</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">번호판</div>
          <div className="text-xl font-bold text-white">{plateNumber}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">총 위반 횟수</div>
          <div className="text-xl font-bold text-white">{violations.length}<span className="text-sm text-gray-500 ml-1">건</span></div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">총 벌금</div>
          <div className="text-xl font-bold text-white">{totalFines.toLocaleString()}<span className="text-sm text-gray-500 ml-1">원</span></div>
        </div>
      </div>

      <div className="space-y-3">
        {violations.map((violation) => (
          <div
            key={violation.id}
            className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <img
                  src={violation.image_gcs_uri}
                  alt={`Vehicle ${violation.ocr_result}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(new Date(violation.detected_at))}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{violation.location || 'Seoul'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-0.5">속도</div>
                <div className={`text-lg font-bold ${
                  violation.detected_speed >= 120 ? 'text-red-400' :
                  violation.detected_speed >= 100 ? 'text-orange-400' :
                  'text-yellow-400'
                }`}>
                  {violation.detected_speed} km/h
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-0.5">벌금</div>
                <div className="text-lg font-bold text-white">
                  {calculateFine(violation.detected_speed, violation.speed_limit).toLocaleString()}원
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-0.5">상태</div>
                <span className={`inline-flex items-center gap-1.5 text-xs ${
                  violation.status === 'completed' ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    violation.status === 'completed' ? 'bg-cyan-400' : 'bg-gray-600'
                  }`} />
                  {violation.status === 'completed' ? '확인됨' : '미확인'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleHistory;
