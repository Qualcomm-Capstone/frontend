import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, Search, ChevronDown } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  filterType: string;
  setFilterType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  searchPlateNumber: string;
  setSearchPlateNumber: (value: string) => void;
  onSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  searchPlateNumber,
  setSearchPlateNumber,
  onSearch
}) => {
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <header className="bg-[#06080f]/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Radar className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Auto<span className="text-cyan-400">Notify</span>
          </span>
          <span className="ml-1 text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
            LIVE
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchPlateNumber}
              onChange={(e) => setSearchPlateNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="차량 번호 검색 (예: 15가1234)"
              className="w-full bg-white/5 text-gray-200 py-2 pl-10 pr-4 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-gray-600"
            />
            <button
              onClick={onSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white/5 text-gray-300 text-sm py-2 pl-3 pr-8 rounded-lg border border-white/10 cursor-pointer focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value="All Violations">전체</option>
              <option value="Checked">확인됨</option>
              <option value="Unchecked">미확인</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white/5 text-gray-300 text-sm py-2 pl-3 pr-8 rounded-lg border border-white/10 cursor-pointer focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value="Newest">최신순</option>
              <option value="Oldest">오래된순</option>
              <option value="Highest Speed">고속순</option>
              <option value="Lowest Speed">저속순</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          </div>

          <NotificationCenter />
        </div>
      </div>
    </header>
  );
};

export default Header;
