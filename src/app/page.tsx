'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ScheduleConfig, DaySchedule } from '@/types/schedule';
import { INITIAL_CONFIG, INITIAL_DAYS } from '@/data/constants';
import { getWeekDates, applyCurrentWeekDates } from '@/utils/dateUtils';
import { EditorSidebar } from '@/components/EditorSidebar';
import { SchedulePreview } from '@/components/SchedulePreview';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Grid, 
  RefreshCw, 
  Layers,
  Eye,
  Sliders
} from 'lucide-react';

export default function Home() {
  const [config, setConfig] = useState<ScheduleConfig>(INITIAL_CONFIG);
  const [days, setDays] = useState<DaySchedule[]>(INITIAL_DAYS);
  const [zoomMode, setZoomMode] = useState<'fit' | '50' | '75' | '100'>('fit');
  const [showGridLines, setShowGridLines] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(0.55);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // 모바일 전용 뷰어/편집 탭 전환 상태 ('edit' | 'preview')
  const [mobileViewTab, setMobileViewTab] = useState<'edit' | 'preview'>('preview');

  const containerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);

  // 1. 첫 마운트 시 localStorage에서 불러오되, 날짜는 항상 오늘 주차 기준으로 자동 업데이트!
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('crayoncast_config');
      const savedDays = localStorage.getItem('crayoncast_days');
      const weekInfo = getWeekDates();

      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig({
          ...parsed,
          // 사용자가 접속/작성하는 날 기준으로 이번 주 날짜 & 주차 자동 갱신
          headerSubtitle: weekInfo.headerSubtitle,
          weekNumber: weekInfo.weekNumber,
        });
      } else {
        setConfig((prev) => ({
          ...prev,
          headerSubtitle: weekInfo.headerSubtitle,
          weekNumber: weekInfo.weekNumber,
        }));
      }

      if (savedDays) {
        const parsedDays: DaySchedule[] = JSON.parse(savedDays);
        // 저장되어 있던 내용(제목, 시간, 메모 등)은 그대로 보존하고 날짜 표기(03.17 등)만 오늘 주차 날짜로 자동 동기화!
        setDays(applyCurrentWeekDates(parsedDays));
      } else {
        setDays(applyCurrentWeekDates(INITIAL_DAYS));
      }
    } catch (e) {
      console.warn('Failed to load saved schedule from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. config 또는 days 수정 시 localStorage에 실시간 자동 저장
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('crayoncast_config', JSON.stringify(config));
      localStorage.setItem('crayoncast_days', JSON.stringify(days));
    } catch (e) {
      console.warn('Failed to auto-save schedule to localStorage:', e);
    }
  }, [config, days, isLoaded]);

  // 전체 데이터 초기화 함수
  const handleResetToDefault = () => {
    if (window.confirm('모든 일정 및 스타일 설정을 초기 상태로 되돌리시겠습니까? (날짜는 오늘 주차로 맞춰집니다)')) {
      const weekInfo = getWeekDates();
      setConfig({
        ...INITIAL_CONFIG,
        headerSubtitle: weekInfo.headerSubtitle,
        weekNumber: weekInfo.weekNumber,
      });
      setDays(applyCurrentWeekDates(INITIAL_DAYS));
      try {
        localStorage.removeItem('crayoncast_config');
        localStorage.removeItem('crayoncast_days');
      } catch (e) {
        // ignore
      }
    }
  };

  // 반응형 Fit 비율 자동 계산 (1920x1080 컨테이너 크기에 맞춤)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      if (zoomMode === '50') {
        setScale(0.5);
        return;
      }
      if (zoomMode === '75') {
        setScale(0.75);
        return;
      }
      if (zoomMode === '100') {
        setScale(1.0);
        return;
      }

      // 'fit' 모드일 때: 모바일 기기 패딩을 고려하여 여백 계산
      const isMobile = window.innerWidth < 768;
      const paddingH = isMobile ? 16 : 48;
      const paddingV = isMobile ? 16 : 48;

      const containerWidth = Math.max(containerRef.current.clientWidth - paddingH, 100);
      const containerHeight = Math.max(containerRef.current.clientHeight - paddingV, 100);

      const scaleX = containerWidth / 1920;
      const scaleY = containerHeight / 1080;
      const fitScale = Math.min(scaleX, scaleY, 0.95);

      // 모바일(360px~430px)에서도 온전히 들어갈 수 있도록 최소 스케일 하한 제거 (최소 0.1)
      setScale(Math.max(fitScale, 0.1));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoomMode, mobileViewTab]);

  // 1920x1080 원본 고해상도 PNG 다운로드 (DESIGN.md: Crisp Export Bar)
  const handleDownloadPng = async () => {
    if (!previewCanvasRef.current || isExporting) return;

    try {
      setIsExporting(true);

      const dataUrl = await toPng(previewCanvasRef.current, {
        pixelRatio: 1, // 1920x1080 원본 1:1 픽셀 매핑
        width: 1920,
        height: 1080,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `Schedule_${config.headerSubtitle.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_1920x1080.png`;
      link.href = dataUrl;
      link.click();

      // 크레용 컬러 테마 축하 콘페티
      confetti({
        particleCount: 75,
        spread: 60,
        colors: ['#FF7675', '#FDCB6E', '#55EFC4', '#74B9FF', '#A29BFE'],
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('PNG export failed:', err);
      alert('이미지 내보내기 중 문제가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FBF9F5] text-[#2C2825]">
      
      {/* 최상단 네비게이션 글로벌 바 (반응형 모바일 최적화) */}
      <nav className="min-h-14 bg-white border-b border-[#E5DFD5] px-3 md:px-6 py-2 flex items-center justify-between shrink-0 z-30 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2C2825] flex items-center justify-center text-[#FBF9F5] font-black text-sm shadow-sm shrink-0">
            ✦
          </div>
          <div>
            <h1 className="font-extrabold text-xs md:text-sm tracking-tight text-[#2C2825] flex items-center gap-1.5 whitespace-nowrap">
              Sketchbook Studio <span className="text-[9px] md:text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF7675]/15 text-[#FF7675] font-mono font-bold">16:9</span>
            </h1>
            <p className="text-[9px] md:text-[10px] text-[#5A544F] hidden sm:block">스트리머 & 크리에이터 스케줄러</p>
          </div>
        </div>

        {/* 중앙 상단 퀵 날짜 정보 (태블릿 이상 표시) */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="bg-[#F5F2EB] px-4 py-1.5 rounded-full border border-[#E5DFD5] text-[#2C2825] font-mono font-medium">
            🗓️ {config.headerSubtitle} ({config.weekNumber})
          </div>
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
          <span className="hidden sm:flex text-[11px] text-[#8C847D] items-center gap-1 font-medium mr-1 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 자동 저장
          </span>

          {/* 모바일 화면에서 [수정하기] ↔ [캔버스 보기] 원클릭 탭 버튼 */}
          <div className="flex lg:hidden bg-[#F5F2EB] p-1 rounded-lg border border-[#E5DFD5]">
            <button
              type="button"
              onClick={() => setMobileViewTab('edit')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                mobileViewTab === 'edit'
                  ? 'bg-white text-[#2C2825] shadow-sm'
                  : 'text-[#5A544F]'
              }`}
            >
              설정
            </button>
            <button
              type="button"
              onClick={() => setMobileViewTab('preview')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                mobileViewTab === 'preview'
                  ? 'bg-white text-[#2C2825] shadow-sm'
                  : 'text-[#5A544F]'
              }`}
            >
              미리보기
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            title="초기 템플릿으로 되돌리기"
            className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg border border-[#E5DFD5] bg-[#F5F2EB] hover:bg-[#E5DFD5] text-[#5A544F] font-bold text-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            초기화
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-[#2C2825] hover:bg-[#1E1B18] text-[#FBF9F5] font-bold text-xs shadow-md transition-all active:translate-y-0.5 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#FF7675]" />
            )}
            <span className="hidden sm:inline">1920×1080 </span>PNG 저장
          </button>
        </div>
      </nav>

      {/* 메인 2-패널 작업 영역 (모바일 반응형 지원) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 좌측 에디터 사이드바 (모바일에서는 mobileViewTab에 따라 표시/숨김) */}
        <div className={`h-full ${mobileViewTab === 'edit' ? 'block w-full' : 'hidden lg:block lg:w-[470px] shrink-0'}`}>
          <EditorSidebar
            config={config}
            setConfig={setConfig}
            days={days}
            setDays={setDays}
          />
        </div>

        {/* 우측 16:9 실시간 뷰어 캔버스 (모바일에서는 mobileViewTab에 따라 표시/숨김) */}
        <div className={`flex-1 flex flex-col bg-[#F5F2EB] overflow-hidden relative ${
          mobileViewTab === 'preview' ? 'flex w-full' : 'hidden lg:flex'
        }`}>
          
          {/* 뷰어 제어 툴바 (모바일 반응형) */}
          <div className="min-h-12 bg-white/80 backdrop-blur-md border-b border-[#E5DFD5] px-3 md:px-6 py-1.5 flex items-center justify-between shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#55EFC4] ring-2 ring-[#55EFC4]/30 animate-pulse" />
              <span className="text-xs font-bold text-[#2C2825]">
                1920 × 1080 (16:9)
              </span>
              <span className="text-[11px] font-mono text-[#8C847D] hidden sm:inline">
                | {config.layoutMode === 'bento' ? '스크랩북 벤토' : config.layoutMode === 'notebook' ? '모눈종이 노트' : config.layoutMode === 'polaroid' ? '밤하늘 폴라로이드' : '7열 클래식'}
              </span>
            </div>

            {/* 줌 배율 & 가이드라인 토글 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F5F2EB] rounded-lg p-0.5 border border-[#E5DFD5] text-xs">
                {(['fit', '50', '75', '100'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setZoomMode(mode)}
                    className={`px-2 py-0.5 rounded-md text-[10px] md:text-[11px] font-semibold transition-all ${
                      zoomMode === mode
                        ? 'bg-white text-[#2C2825] font-bold shadow-sm'
                        : 'text-[#5A544F] hover:text-[#2C2825]'
                    }`}
                  >
                    {mode === 'fit' ? '맞춤' : `${mode}%`}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowGridLines(!showGridLines)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                  showGridLines
                    ? 'border-[#FF7675] bg-[#FF7675]/15 text-[#a83639]'
                    : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:bg-[#F5F2EB]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> <span className="hidden sm:inline">가이드 라인</span>
              </button>
            </div>
          </div>

          {/* 16:9 비율 캔버스 뷰포트 (가운데 정렬) */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto flex items-center justify-center p-2 md:p-6 bg-[#F5F2EB]"
          >
            <div
              style={{
                width: `${1920 * scale}px`,
                height: `${1080 * scale}px`,
                position: 'relative',
                flexShrink: 0,
              }}
              className="transition-all duration-150 paper-shadow rounded-xl md:rounded-2xl overflow-hidden mx-auto"
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: '1920px',
                  height: '1080px',
                }}
              >
                <SchedulePreview
                  config={config}
                  days={days}
                  previewRef={previewCanvasRef}
                  showGridLines={showGridLines}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
