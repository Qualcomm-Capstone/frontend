import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ViolationDetails from "./components/ViolationDetails";
import LandingPage from "./components/LandingPage";
import { Violation, StatsData } from "./types";
import VehicleHistory from "./components/VehicleHistory";
import FCMNotification from "./components/FCMNotification";
import NotificationCenter from "./components/NotificationCenter";

function DashboardPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    null
  );
  const [filterType, setFilterType] = useState<string>("All Violations");
  const [sortOrder, setSortOrder] = useState<string>("Newest");
  const [loading, setLoading] = useState<boolean>(true);
  const [showVehicleHistory, setShowVehicleHistory] = useState(false);
  const [vehicleViolations, setVehicleViolations] = useState<Violation[]>([]);
  const [searchPlateNumber, setSearchPlateNumber] = useState("");
  const [stats, setStats] = useState<StatsData>({
    totalViolations: 0,
    checked: 0,
    pendingReview: 0,
    avgSpeed: 0,
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // /detections/ GET 에서 데이터 불러오기
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/detections/`)
      .then((res) => res.json())
      .then((data) => {
        setViolations(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API fetch error:", err);
        setLoading(false);
      });

    // 통계 데이터 서버에서 가져오기
    fetch(`${API_BASE_URL}/detections/statistics/`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalViolations: data.total_detections ?? 0,
          checked: data.completed_count ?? 0,
          pendingReview: data.pending_count ?? 0,
          avgSpeed: Math.round(data.avg_speed ?? 0),
        });
      })
      .catch((err) => {
        console.error("Statistics fetch error:", err);
      });

  }, []);

  const handleViolationSelect = (violation: Violation) => {
    // 이미 선택된 위반 사항을 다시 클릭하면 닫기
    if (selectedViolation?.id === violation.id) {
      setSelectedViolation(null);
    } else {
      setSelectedViolation(violation);
    }
  };
  const handleSearchVehicle = () => {
    if (!searchPlateNumber) return;

    const result = violations.filter((v) => v.ocr_result === searchPlateNumber);
    setVehicleViolations(result);
    setShowVehicleHistory(true);
  };

  const handleCloseVehicleHistory = () => {
    setShowVehicleHistory(false);
    setSearchPlateNumber("");
    setVehicleViolations([]);
  };
  const handleCloseDetails = () => {
    setSelectedViolation(null);
  };

  const filteredViolations = violations.filter((violation) => {
    if (filterType === "All Violations") return true;
    if (filterType === "Checked") return violation.status === 'completed';
    if (filterType === "Unchecked") return violation.status !== 'completed';
    return true;
  });

  const sortedViolations = [...filteredViolations].sort((a, b) => {
    if (sortOrder === "Newest") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOrder === "Oldest") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortOrder === "Highest speed") {
      return b.detected_speed - a.detected_speed;
    } else if (sortOrder === "Lowest speed") {
      return a.detected_speed - b.detected_speed;
    }
    return 0;
  });

  return (
    <>
      <FCMNotification/>
      <div className="min-h-screen bg-[#06080f] text-gray-100 flex flex-col">
        <Header
          filterType={filterType}
          setFilterType={setFilterType}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          searchPlateNumber={searchPlateNumber}
          setSearchPlateNumber={setSearchPlateNumber}
          onSearch={handleSearchVehicle}
        />

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div
            className={`flex-1 ${selectedViolation ? "md:w-2/3" : "w-full"}`}
          >
            {showVehicleHistory && (
              <div className="p-6">
                <VehicleHistory
                  violations={vehicleViolations}
                  plateNumber={searchPlateNumber}
                  onClose={handleCloseVehicleHistory}
                />
              </div>
            )}
            <Dashboard
              violations={sortedViolations}
              stats={stats}
              onSelectViolation={setSelectedViolation}
              selectedViolationId={selectedViolation?.id}
            />
          </div>

          {selectedViolation && (
            <div className="md:w-1/3 border-l border-gray-700 h-full overflow-auto">
              <ViolationDetails
                violation={selectedViolation}
                onClose={handleCloseDetails}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
