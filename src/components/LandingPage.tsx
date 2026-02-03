import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  ShieldCheck,
  Bell,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Zap,
  Eye,
  Database,
  MousePointer,
  Monitor,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [is3DMode, setIs3DMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroScale = 1 + scrollY * 0.0003;

  return (
    <div className="landing-page bg-[#06080f] text-white overflow-x-hidden">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={`mx-auto px-6 lg:px-12 py-4 flex items-center justify-between transition-all duration-500 ${
            scrollY > 50
              ? "bg-[#06080f]/80 backdrop-blur-xl border-b border-white/5"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Auto<span className="text-cyan-400">Notify</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#stats" className="hover:text-white transition-colors">
              Statistics
            </a>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Spline 3D Background */}
        <div
          className="absolute inset-0"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
          }}
        >
          <iframe
            src="https://my.spline.design/pushittothelimit-PTo0z88yEUU4s5vocSIcujb6/"
            className={`w-full h-full border-0 ${
              is3DMode ? "" : "pointer-events-none"
            }`}
            title="3D Vehicle Scene"
            allow="autoplay"
          />
          {/* Gradient overlays - pointer-events-none so they never block the iframe */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              is3DMode ? "opacity-10" : "opacity-100"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080f]/70 via-transparent to-[#06080f]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080f]/60 via-transparent to-[#06080f]/60" />
          </div>
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-700 ${
            is3DMode ? "opacity-10 blur-sm scale-95 pointer-events-none" : "opacity-100"
          }`}
          style={{ opacity: is3DMode ? 0.1 : heroOpacity }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8 landing-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Detection System
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6 landing-fade-in landing-delay-1">
            <span className="block">Intelligent</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Speed Detection
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed landing-fade-in landing-delay-2">
            AI 기반 실시간 과속 차량 감지 시스템으로
            <br className="hidden sm:block" />
            도로 안전을 한 단계 높이세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 landing-fade-in landing-delay-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
            >
              Dashboard 바로가기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-full border border-white/15 text-sm font-medium hover:bg-white/5 transition-all duration-300"
            >
              자세히 알아보기
            </a>
          </div>
        </div>

        {/* 3D Toggle Button */}
        <button
          onClick={() => setIs3DMode(!is3DMode)}
          className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-500 shadow-2xl ${
            is3DMode
              ? "bg-cyan-500 text-white shadow-cyan-500/30"
              : "bg-white/10 backdrop-blur-md text-white border border-white/15 hover:bg-white/20"
          }`}
        >
          <MousePointer className="w-4 h-4" />
          {is3DMode ? "스크롤 모드로 복귀" : "3D 차량 조작하기"}
        </button>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${
            is3DMode || scrollY > 100 ? "opacity-0" : "opacity-60"
          }`}
        >
          <ChevronDown className="w-6 h-6 animate-bounce text-gray-400" />
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section
        id="features"
        className="relative z-10 bg-[#06080f] py-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Why <span className="text-cyan-400">AutoNotify</span>?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              최첨단 AI 기술로 실시간 교통 위반을 감지하고 관리하는 통합 시스템
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Radar className="w-6 h-6" />,
                title: "실시간 감지",
                desc: "AI가 카메라 영상을 분석하여 과속 차량을 즉시 탐지합니다.",
                gradient: "from-cyan-500/20 to-blue-500/20",
                border: "border-cyan-500/10",
                iconColor: "text-cyan-400",
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "번호판 인식",
                desc: "딥러닝 기반 OCR로 차량 번호판을 정확하게 식별합니다.",
                gradient: "from-blue-500/20 to-purple-500/20",
                border: "border-blue-500/10",
                iconColor: "text-blue-400",
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "즉시 알림",
                desc: "위반 감지 즉시 관리자에게 푸시 알림을 전송합니다.",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/10",
                iconColor: "text-purple-400",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "통계 분석",
                desc: "위반 데이터를 시각화하여 교통 패턴을 분석합니다.",
                gradient: "from-pink-500/20 to-orange-500/20",
                border: "border-pink-500/10",
                iconColor: "text-pink-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group relative p-8 rounded-2xl border ${feature.border} bg-gradient-to-b ${feature.gradient} hover:scale-[1.02] transition-all duration-500`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${feature.iconColor}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="relative z-10 bg-[#06080f] py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
              Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              4단계 프로세스로 과속 차량을 자동 감지하고 관리합니다
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  icon: <Monitor className="w-6 h-6" />,
                  title: "영상 수집",
                  desc: "도로에 설치된 카메라가 실시간 영상을 전송합니다.",
                },
                {
                  step: "02",
                  icon: <Zap className="w-6 h-6" />,
                  title: "AI 분석",
                  desc: "딥러닝 모델이 차량 속도를 측정하고 과속 여부를 판단합니다.",
                },
                {
                  step: "03",
                  icon: <Database className="w-6 h-6" />,
                  title: "데이터 저장",
                  desc: "위반 차량의 번호판, 속도, 시간 정보를 저장합니다.",
                },
                {
                  step: "04",
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "알림 & 관리",
                  desc: "관리자에게 알림을 보내고 대시보드에서 위반 이력을 관리합니다.",
                },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 group-hover:border-cyan-500/40 transition-colors duration-500">
                    <span className="text-cyan-400">{item.icon}</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-500/50 tracking-widest">
                    STEP {item.step}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section id="stats" className="relative z-10 bg-[#06080f] py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-12 md:p-16 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                System Performance
              </h2>
              <p className="text-gray-500">
                실시간으로 도로 안전을 지키고 있습니다
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "99.2%", label: "감지 정확도" },
                { value: "<0.5s", label: "응답 속도" },
                { value: "24/7", label: "무중단 모니터링" },
                { value: "4 Lane", label: "다중 차선 지원" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative z-10 bg-[#06080f] py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              시작하세요
            </span>
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            실시간 대시보드에서 과속 차량 감지 현황을 확인하세요.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="group px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 inline-flex items-center gap-3"
          >
            Dashboard 바로가기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 bg-[#06080f] border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Radar className="w-4 h-4 text-cyan-500" />
            <span>
              Auto<span className="text-cyan-500">Notify</span>
            </span>
            <span className="ml-2">
              &copy; {new Date().getFullYear()} Speed Detection System
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Capstone Design Project
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
