import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Violation } from '../types';

interface ViolationsTableProps {
  violations: Violation[];
  onSelectViolation: (violation: Violation) => void;
  onDeleteViolation: (id: number) => void;
  selectedViolationId?: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ViolationsTable: React.FC<ViolationsTableProps> = ({
  violations,
  onSelectViolation,
  onDeleteViolation,
  selectedViolationId
}) => {
  const getSpeedBadge = (speed: number) => {
    if (speed >= 120) return { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Critical' };
    if (speed >= 100) return { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', label: 'High' };
    return { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', label: 'Warning' };
  };

  return (
    <div className="flex-1 overflow-auto rounded-2xl border border-white/5 bg-white/[0.02]">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              차량 이미지
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              번호판
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              속도
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              감지 시간
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {violations.map((violation) => {
            const speedBadge = getSpeedBadge(violation.detected_speed);
            return (
              <tr
                key={violation.id}
                className={`${
                  selectedViolationId === violation.id
                    ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500'
                    : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                } transition-all duration-200 cursor-pointer`}
                onClick={() => onSelectViolation(violation)}
              >
                <td className="px-5 py-3.5 text-sm font-mono text-gray-400">
                  #{violation.id}
                </td>
                <td className="px-5 py-3.5">
                  <div className="h-10 w-14 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={violation.image_gcs_uri}
                      alt={`Vehicle ${violation.ocr_result}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-white">
                  {violation.ocr_result}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${speedBadge.color}`}>
                    {violation.detected_speed} km/h
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${
                    violation.status === 'completed'
                      ? 'text-cyan-400'
                      : 'text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      violation.status === 'completed' ? 'bg-cyan-400' : 'bg-gray-600'
                    }`} />
                    {violation.status === 'completed' ? '확인됨' : '미확인'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {formatDate(violation.detected_at)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-1.5 text-gray-500 hover:text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectViolation(violation);
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteViolation(violation.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {violations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-sm">조건에 맞는 위반 기록이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ViolationsTable;
