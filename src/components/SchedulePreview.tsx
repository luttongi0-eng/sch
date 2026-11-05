'use client';

import React, { useState } from 'react';
import { DaySchedule, ScheduleConfig, PlacedSticker } from '@/types/schedule';
import { 
  Gamepad2, 
  Coffee, 
  Moon, 
  Sparkles, 
  Volume2, 
  Tv, 
  Bell, 
  Calendar, 
  Radio, 
  Wifi, 
  WifiOff,
  Trash2,
  RotateCw
} from 'lucide-react';

interface PreviewProps {
  config: ScheduleConfig;
  setConfig?: React.Dispatch<React.SetStateAction<ScheduleConfig>>;
  days: DaySchedule[];
  stickers?: PlacedSticker[];
  onUpdateSticker?: (id: string, updates: Partial<PlacedSticker>) => void;
  onRemoveSticker?: (id: string) => void;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  showGridLines?: boolean;
  onUpdateDayCoords?: (dayId: string, x: number, y: number) => void;
  viewportScale?: number;
}

export const SchedulePreview: React.FC<PreviewProps> = ({
  config,
  setConfig,
  days,
  stickers = [],
  onUpdateSticker,
  onRemoveSticker,
  previewRef,
  showGridLines = false,
  onUpdateDayCoords,
  viewportScale = 1,
}) => {
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      case 'chat':
        return <Coffee className="w-4 h-4" />;
      case 'sleep':
        return <Moon className="w-4 h-4" />;
      case 'sparkle':
        return <Sparkles className="w-4 h-4" />;
      case 'audio':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Tv className="w-4 h-4" />;
    }
  };

  // 16진수 색상과 opacity(0~100)를 결합하여 rgba 문자열 생성
  const hexToRgba = (hex: string, opacity: number) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 255;
    const a = Math.max(0, Math.min(100, opacity)) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const getCardStyle = (day: DaySchedule) => {
    const isCustom = !!day.customBgColor;
    const bgBase = isCustom ? day.customBgColor! : config.cardBgColor;
    // 특정 요일 전용 투명도(customOpacity)가 설정되어 있으면 우선 적용, 아니면 전체 cardBgOpacity 적용
    const opacityToUse = day.customOpacity !== undefined ? day.customOpacity : config.cardBgOpacity;
    const rgbaBg = hexToRgba(bgBase, opacityToUse);

    return {
      backgroundColor: rgbaBg,
      backdropFilter: `blur(${config.cardBlur}px)`,
      WebkitBackdropFilter: `blur(${config.cardBlur}px)`,
      borderColor: config.cardBorderColor,
      color: day.customTextColor || config.cardTextColor,
    };
  };

  // 글씨체 비율(fontSizeScale)을 각 텍스트 요소의 기본 픽셀에 직접 곱하여 인라인 폰트 크기 반환
  const scale = (config.fontSizeScale || 100) / 100;
  const fs = (basePx: number) => ({ fontSize: `${Math.round(basePx * scale)}px` });

  // 사용자가 선택한 강조 요일(isFeatured)의 인덱스 찾기 (기본값: 금요일 index 4)
  const featuredIndex = days.findIndex((d) => d.isFeatured);
  const activeFeaturedIdx = featuredIndex !== -1 ? featuredIndex : 4; // 기본 금요일(4)

  // 요일 순서(월~일)대로 흘러가며 한 행당 4열 가중치(총 4 컬럼)를 채우도록 상단 행과 하단 행 분할
  // 강조 카드는 2열(span 2)을 차지하므로, 그 행은 [강조(2열) + 일반 2개(2열)] = 총 4열이 됨.
  // 다른 행은 일반 4개(4열)가 됨.
  const isFeaturedInTopRow = activeFeaturedIdx < 3;
  const topRowDays = isFeaturedInTopRow ? days.slice(0, 3) : days.slice(0, 4);
  const bottomRowDays = isFeaturedInTopRow ? days.slice(3, 7) : days.slice(4, 7);

  // 카드 렌더링 헬퍼 함수
  const renderCard = (day: DaySchedule, isLarge: boolean = false) => {
    const cardStyle = getCardStyle(day);
    const isSpecialDark = !!day.customBgColor;

    if (isLarge) {
      return (
        <div
          key={day.id}
          className="col-span-2 relative rounded-2xl p-7 border shadow-[0_8px_24px_-4px_rgba(44,40,37,0.12)] flex flex-col justify-between overflow-hidden"
          style={cardStyle}
        >
          {config.showWashiTape && (
            <div
              className="washi-tape absolute top-0 left-16 w-24 h-4 z-20 pointer-events-none"
              style={{
                transform: `rotate(${day.tapeAngle || -1}deg)`,
                borderRadius: '3px 4px 2px 3px',
              }}
            />
          )}

          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full font-black tracking-wide text-white shadow-sm"
                    style={{ ...fs(12), backgroundColor: day.crayonColor }}
                  >
                    {day.dayEnglish} {day.day} {day.dateStr}
                  </span>
                  <span
                    className={`font-black tracking-tight ${isSpecialDark ? 'text-white' : 'text-[#2C2825]'}`}
                    style={fs(24)}
                  >
                    {day.dayEnglish} Special
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full border backdrop-blur-sm flex items-center gap-1.5 ${
                    isSpecialDark ? 'bg-white/15 text-white border-white/20' : 'bg-black/5 text-[#2C2825] border-black/10'
                  }`}>
                    <Radio className="w-3.5 h-3.5 text-[#FF7675] animate-pulse" /> {day.time}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-lg bg-[#FF7675]/20 text-[#FAB1A0] text-xs font-bold border border-[#FF7675]/30 mb-2">
                  {day.badge}
                </span>
                <h2
                  className={`font-black leading-tight ${isSpecialDark ? 'text-white' : 'text-[#2C2825]'}`}
                  style={fs(24)}
                >
                  {day.title}
                </h2>
                <p
                  className={`mt-2 max-w-xl leading-relaxed ${isSpecialDark ? 'text-[#e9e1dc]' : 'text-[#5A544F]'}`}
                  style={fs(14)}
                >
                  {day.description}
                </p>
              </div>
            </div>

            {/* 사운드 웨이브 & 크레용 스탬프 */}
            <div className={`pt-4 border-t flex items-center justify-between ${isSpecialDark ? 'border-white/10' : 'border-black/5'}`}>
              <span className="text-xs font-bold text-[#FAB1A0] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FF7675]" />
                {day.footerNote || '하이라이트 메인 방송'}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-4 bg-[#FF7675] rounded-full animate-pulse" />
                <div className="w-1.5 h-7 bg-[#FDCB6E] rounded-full animate-bounce" />
                <div className="w-1.5 h-5 bg-[#55EFC4] rounded-full animate-pulse" />
                <div className="w-1.5 h-8 bg-[#74B9FF] rounded-full animate-bounce" />
                <div className="w-1.5 h-4 bg-[#A29BFE] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 일반 1열 카드
    return (
      <div
        key={day.id}
        className="relative rounded-2xl p-6 border shadow-[0_4px_12px_-2px_rgba(44,40,37,0.06),0_1px_3px_rgba(44,40,37,0.04)] flex flex-col justify-between overflow-hidden"
        style={cardStyle}
      >
        {/* DESIGN.md: Masking Tape Pin (Washi Tape) */}
        {config.showWashiTape && (
          <div
            className="washi-tape absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3.5 z-20 pointer-events-none"
            style={{
              transform: `translateX(-50%) rotate(${day.tapeAngle || 0}deg)`,
              borderRadius: '2px 4px 3px 2px',
            }}
          />
        )}

        <div>
          {/* 헤더: 요일 약어 Pill + Space Grotesk 날짜 */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2C2825]/5">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full font-black tracking-wide shadow-sm"
                style={{
                  ...fs(12),
                  backgroundColor: day.crayonColor,
                  color: isSpecialDark ? '#2C2825' : '#FFFFFF',
                }}
              >
                {day.dayEnglish} {day.day}
              </span>
            </div>
            <span
              className={`font-mono font-bold ${isSpecialDark ? 'text-[#F5F2EB]' : 'text-[#5A544F]'}`}
              style={fs(14)}
            >
              {day.dateStr}
            </span>
          </div>

          {/* 상태 & 시간 Chip */}
          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: day.crayonColor }}
              />
              <span
                className={`font-mono font-bold tracking-tight ${isSpecialDark ? 'text-[#F5F2EB]' : 'text-[#2C2825]'}`}
                style={fs(12)}
              >
                {day.time}
              </span>
            </div>
            <div>
              {day.isOnline ? (
                <span className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-[#55EFC4]/20 text-[#00725a] border border-[#55EFC4]/40">
                  <Wifi className="w-3 h-3" /> ON
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-[#FF7675]/15 text-[#a83639] border border-[#FF7675]/30">
                  <WifiOff className="w-3 h-3" /> OFF
                </span>
              )}
            </div>
          </div>

          {/* 메인 일정 타이틀 */}
          <h3
            className={`mt-3 font-bold leading-snug line-clamp-2 ${isSpecialDark ? 'text-white' : 'text-[#2C2825]'}`}
            style={fs(18)}
          >
            {day.title}
          </h3>

          {/* 세부 메모 */}
          <p
            className={`mt-1.5 line-clamp-2 leading-relaxed ${isSpecialDark ? 'text-[#e9e1dc]' : 'text-[#5A544F]'}`}
            style={fs(12)}
          >
            {day.description}
          </p>
        </div>

        {/* 카드 하단 뱃지 & 아이콘 */}
        <div className="pt-3 border-t border-[#2C2825]/5 flex items-center justify-between">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: isSpecialDark ? 'rgba(255,255,255,0.15)' : '#F5F2EB',
              color: isSpecialDark ? '#FFFFFF' : '#2C2825',
              border: isSpecialDark ? 'none' : '1px solid rgba(44, 40, 37, 0.08)',
            }}
          >
            {getIcon(day.tagIcon)}
            {day.footerNote || day.badge}
          </span>
          <span className="opacity-50">{getIcon(day.tagIcon)}</span>
        </div>
      </div>
    );
  };

  // 배경 이미지 스타일 계산 (React style 충돌 방지를 위해 background 축약형 대신 세부 속성 분리)
  const getCanvasBackgroundStyle = (): React.CSSProperties => {
    if (config.userBgImage) {
      const sizeProp =
        config.bgImageSizeMode === 'contain'
          ? 'contain'
          : config.bgImageSizeMode === 'fill'
          ? '100% 100%'
          : 'cover';

      return {
        backgroundColor: '#FBF9F5',
        backgroundImage: `url(${config.userBgImage})`,
        backgroundSize: sizeProp,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }

    // 그라디언트 또는 색상 값 처리
    const isGradient = config.customBgValue.includes('gradient');
    return {
      backgroundColor: isGradient ? undefined : config.customBgValue,
      backgroundImage: isGradient ? config.customBgValue : undefined,
      backgroundSize: undefined,
      backgroundPosition: undefined,
      backgroundRepeat: undefined,
    };
  };

  return (
    <div
      ref={previewRef}
      id="schedule-canvas-1080"
      className="relative overflow-hidden select-none transition-all"
      style={{
        width: '1920px',
        height: '1080px',
        fontFamily: config.selectedFont,
        ['--font-scale' as any]: (config.fontSizeScale || 100) / 100,
        ...getCanvasBackgroundStyle(),
        transformOrigin: 'top left',
      }}
    >
      {/* 텍스처 배경 레이어 (DESIGN.md: Grid 또는 Grain 질감) */}
      {config.textureMode === 'grid' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(44, 40, 37, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(44, 40, 37, 0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      )}
      {config.textureMode === 'grain' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(rgba(44, 40, 37, 0.15) 1px, transparent 0)',
            backgroundSize: '8px 8px'
          }}
        />
      )}

      {/* 가이드 라인 (토글 시) */}
      {showGridLines && (
        <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-[#FF7675]/40 z-50 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 border-t border-[#FF7675]/30" />
          <div className="absolute inset-y-0 left-1/2 border-l border-[#FF7675]/30" />
          <span className="bg-[#2C2825] text-[#FBF9F5] text-xs font-mono px-3 py-1.5 rounded-md shadow-md">
            1920 × 1080 Safety Center Line
          </span>
        </div>
      )}

      {/* 내부 스케치북 패드 컨테이너 (DESIGN.md: 64px 마진 & paper-shadow) */}
      <div className="relative w-full h-full p-16 flex flex-col justify-between z-10">
        
        {/* ========================================================
            1. 헤더 영역 (DESIGN.md: Plus Jakarta Sans + Space Grotesk)
           ======================================================== */}
        {!(config.layoutMode === 'custom_diy' && config.diyShowHeader === false) && (
          <header className="flex items-center justify-between gap-8 pb-5 border-b border-[#2C2825]/10">
            <div className="flex items-center gap-7">
              {/* 타이틀 로고 */}
              <div className="flex flex-col">
                <h1
                  className="font-black tracking-tight text-[#2C2825] flex items-center gap-3"
                  style={fs(48)}
                >
                  <span className="font-serif italic font-normal text-[#FF7675]">Weekly</span>
                  <span>{config.headerTitle}</span>
                </h1>
              </div>

              {/* 날짜 및 주차 뱃지 (Space Grotesk 모노 폰트) */}
              <div className="flex items-center gap-3 bg-[#FFFFFF]/85 backdrop-blur-md px-5 py-2.5 rounded-xl border border-[#2C2825]/10 shadow-[0_2px_8px_rgba(44,40,37,0.04)]">
                <Calendar className="w-5 h-5 text-[#FF7675]" />
                <div className="flex flex-col">
                  <span
                    className="font-mono font-bold text-[#2C2825] tracking-tight"
                    style={fs(14)}
                  >
                    {config.headerSubtitle}
                  </span>
                  <span
                    className="font-semibold text-[#5A544F]"
                    style={fs(12)}
                  >
                    {config.weekNumber}
                  </span>
                </div>
              </div>

              {/* 공지사항 티커 (Crayon Coral & Paper Sheet) */}
              {config.noticeText && (
                <div className="flex items-center gap-3 bg-[#FFFFFF]/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#2C2825]/10 shadow-[0_2px_6px_rgba(44,40,37,0.04)] max-w-xl">
                  <span className="bg-[#FF7675] text-[#FFFFFF] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Bell className="w-3 h-3" /> Notice
                  </span>
                  <span
                    className="font-medium text-[#2C2825] truncate"
                    style={fs(14)}
                  >
                    {config.noticeText}
                  </span>
                </div>
              )}
            </div>

            {/* 우측 플랫폼/채널 태그 */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-2 rounded-xl bg-[#FFFFFF]/80 backdrop-blur-md border border-[#2C2825]/10 shadow-[0_2px_6px_rgba(44,40,37,0.04)] text-[#2C2825] font-mono font-bold text-xs tracking-wider">
                {config.channelTags}
              </div>
            </div>
          </header>
        )}

        {/* ========================================================
            2. 메인 스케줄 영역 (Bento, Linear, 또는 일러스트 모눈종이 Notebook)
           ======================================================== */}
        {config.layoutMode === 'bento' ? (
          <main className="flex-1 my-5 flex flex-col justify-between gap-5">
            {/* 상단 행 (요일 순서대로 렌더링, 강조 카드는 2열 차지) */}
            <div className="grid grid-cols-4 gap-5 h-[48%]">
              {topRowDays.map((day) => renderCard(day, day.isFeatured))}
            </div>

            {/* 하단 행 (요일 순서대로 렌더링, 강조 카드는 2열 차지) */}
            <div className="grid grid-cols-4 gap-5 h-[48%]">
              {bottomRowDays.map((day) => renderCard(day, day.isFeatured))}
            </div>
          </main>
        ) : config.layoutMode === 'notebook' ? (
          /* ========================================================
             일러스트/캐릭터 배치 전용 모눈종이 노트 (Notebook Mode)
             ======================================================== */
          <main className="flex-1 my-2 flex items-center justify-between gap-10 relative">
            
            {/* 좌측 또는 우측: 캐릭터/일러스트 및 Art By 영역 */}
            <div className={`flex flex-col justify-end h-full py-6 pointer-events-none ${
              config.notebookAlign === 'left' ? 'order-2 items-end' : 'order-1 items-start'
            }`}>
              {/* Art By 크레딧 뱃지 */}
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-6 py-3.5 rounded-2xl border-2 border-[#2C2825]/15 shadow-[0_8px_20px_rgba(44,40,37,0.08)]">
                <span className="block text-xs font-black text-[#2C2825]">Art By.</span>
                <span className="text-sm font-bold text-[#5A544F]">
                  {config.artByText || '그려주신분 이름'}
                </span>
              </div>
            </div>

            {/* 메인 모눈종이 스케줄 보드 */}
            <div
              className={`w-[820px] rounded-3xl border-4 border-[#2C2825]/30 p-8 shadow-[0_12px_36px_rgba(44,40,37,0.12)] relative ${
                config.notebookAlign === 'left' ? 'order-1' : 'order-2'
              }`}
              style={{
                backgroundColor: hexToRgba(config.cardBgColor, config.cardBgOpacity),
                backdropFilter: `blur(${config.cardBlur}px)`,
                WebkitBackdropFilter: `blur(${config.cardBlur}px)`,
                borderColor: config.cardBorderColor,
              }}
            >
              {/* 모눈종이 격자 패턴 오버레이 */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-45"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(44, 40, 37, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(44, 40, 37, 0.12) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* SCHEDULE 버블 헤더 뱃지 */}
              <div className="flex flex-col items-center -mt-13 mb-3 relative z-10">
                <div
                  className="px-8 py-2 rounded-2xl text-white font-black tracking-widest text-3xl shadow-lg border-2 border-white"
                  style={{
                    backgroundColor: '#2C2825',
                    letterSpacing: '0.15em',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  SCHEDULE
                </div>
                {/* 기간 캡슐 뱃지 */}
                <div className="mt-2.5 px-6 py-1.5 rounded-full bg-[#5A544F]/75 backdrop-blur-sm text-white font-mono font-bold text-xs shadow-sm">
                  {config.headerSubtitle.replace('|', '~')}
                </div>
              </div>

              {/* 7일간 리스트 테이블 */}
              <div className="divide-y-2 divide-[#2C2825]/15 relative z-10">
                {days.map((day) => (
                  <div
                    key={day.id}
                    className="py-3 px-2 flex items-center justify-between gap-4 transition-all"
                  >
                    {/* 요일 영문명 */}
                    <div className="w-16 shrink-0 flex items-center justify-center">
                      <span
                        className="font-black text-sm tracking-wider px-2 py-0.5 rounded-md"
                        style={{
                          color: '#2C2825',
                          backgroundColor: day.isOnline ? `${day.crayonColor}30` : 'rgba(44,40,37,0.06)',
                        }}
                      >
                        {day.dayEnglish}
                      </span>
                    </div>

                    {/* 세로 구분선 */}
                    <div className="w-[1.5px] h-6 bg-[#2C2825]/20 shrink-0" />

                    {/* 일정 제목 및 부가 설명 */}
                    <div className="flex-1 min-w-0 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black tracking-tight leading-snug truncate ${
                            day.isOnline ? 'text-[#2C2825]' : 'text-[#8C847D]'
                          }`}
                          style={fs(16)}
                        >
                          {day.title}
                        </span>
                        {!day.isOnline && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF7675]/15 text-[#a83639]">
                            휴방
                          </span>
                        )}
                      </div>
                      {day.description && (
                        <p
                          className="text-[#5A544F] font-medium truncate mt-0.5"
                          style={fs(12)}
                        >
                          {day.description}
                        </p>
                      )}
                    </div>

                    {/* 방송 시간 표기 */}
                    <div className="shrink-0 text-right font-mono font-black text-sm tracking-tight text-[#2C2825] px-2">
                      {day.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        ) : config.layoutMode === 'polaroid' ? (
          /* ========================================================
             폴라로이드 프레임 & 캡슐 바 (Night Sky Polaroid Mode)
             ======================================================== */
          <main className="flex-1 my-2 flex items-center justify-between gap-12 relative">
            
            {/* 좌측 폴라로이드 액자 프레임 */}
            <div className="w-[580px] h-[720px] bg-[#3E3A36] rounded-3xl p-6 border-4 border-[#2C2825]/30 shadow-[0_16px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between shrink-0 relative overflow-hidden">
              {/* 사진 영역 */}
              <div className="w-full flex-1 bg-[#D3CECA] rounded-2xl border-2 border-black/10 overflow-hidden relative flex items-center justify-center">
                {config.polaroidPhoto || config.userBgImage ? (
                  <img
                    src={config.polaroidPhoto || config.userBgImage!}
                    alt="Artist Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-[#5A544F]">
                    <div className="text-4xl mb-2 opacity-60">🖼️</div>
                    <p className="font-bold text-sm">일러스트 / 프로필 사진</p>
                    <p className="text-[11px] opacity-75 mt-1">에디터에서 사진을 등록할 수 있습니다</p>
                  </div>
                )}
              </div>

              {/* 하단 ARTIST 크레딧 라벨 */}
              <div className="pt-5 pb-2 flex items-center justify-between">
                <div>
                  <span className="font-black text-xl tracking-wider text-[#FBF9F5] block">
                    ARTIST.
                  </span>
                  <span className="text-sm font-bold text-[#D3CECA]">
                    {config.artByText || '그려주신분 이름'}
                  </span>
                </div>
                <div className="flex gap-1.5 opacity-60">
                </div>
              </div>
            </div>

            {/* 우측 SCHEDULE 타이틀 & 7개 둥근 캡슐 바 */}
            <div className="flex-1 flex flex-col justify-center h-full max-w-[880px] z-10">
              
              {/* 상단 굵은 입체 SCHEDULE 타이틀 */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-black tracking-widest text-4xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  style={{
                    letterSpacing: '0.12em',
                    textShadow: '3px 3px 0 #2C2825, -2px -2px 0 #2C2825, 2px -2px 0 #2C2825, -2px 2px 0 #2C2825',
                  }}
                >
                  SCHEDULE
                </h2>
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/25">
                  {config.headerSubtitle.replace('|', '~')}
                </span>
              </div>

              {/* 7개 요일 캡슐 바 리스트 */}
              <div className="space-y-3.5">
                {days.map((day) => (
                  <div key={day.id} className="flex items-center gap-3">
                    {/* 달과 구름 요일 뱃지 */}
                    <div className="relative w-13 h-13 rounded-full bg-white border-2 border-[#2C2825] flex items-center justify-center shrink-0 shadow-md">
                      {/* 초승달 장식 */}
                      <span className="absolute -top-1.5 -right-1 text-sm select-none">🌙</span>
                      <span className="font-black text-base text-[#2C2825] z-10">
                        {day.day}
                      </span>
                    </div>

                    {/* 흰색 둥근 캡슐 일정 바 */}
                    <div
                      className="flex-1 bg-white rounded-full px-6 py-2.5 border-2 border-[#2C2825]/15 shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between transition-all"
                      style={{
                        backgroundColor: day.isOnline ? '#FFFFFF' : '#F5F2EB',
                      }}
                    >
                      {/* 일정 제목 */}
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                        <span
                          className={`font-black truncate ${
                            day.isOnline ? 'text-[#2C2825]' : 'text-[#8C847D]'
                          }`}
                          style={fs(16)}
                        >
                          {day.title}
                        </span>
                        {!day.isOnline && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7675]/15 text-[#a83639] shrink-0">
                            휴방
                          </span>
                        )}
                        {day.description && day.isOnline && (
                          <span
                            className="text-[#8C847D] text-xs font-semibold truncate hidden md:inline"
                            style={fs(12)}
                          >
                            - {day.description}
                          </span>
                        )}
                      </div>

                      {/* 세로 구분선 */}
                      <div className="w-[1.5px] h-5 bg-[#2C2825]/20 shrink-0 mx-2" />

                      {/* 방송 시간 표기 */}
                      <div className="shrink-0 font-mono font-black text-sm tracking-tight text-[#2C2825] w-24 text-right">
                        {day.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </main>
        ) : config.layoutMode === 'custom_diy' ? (
          /* ========================================================
             커스텀 템플릿 DIY 자유 배치 모드 (Free Drag & Drop Layout)
             ======================================================== */
          <main className="absolute inset-0 pointer-events-auto">
            {/* 1. DIY 자유 드래그 커스텀 삽입 이미지 (일러스트/캐릭터 사진) */}
            {config.diyCustomImage && (
              <div
                style={{
                  position: 'absolute',
                  left: `${config.diyImageX ?? 180}px`,
                  top: `${config.diyImageY ?? 180}px`,
                  width: `${config.diyImageWidth ?? 580}px`,
                  height: `${config.diyImageHeight ?? 560}px`,
                  cursor: setConfig ? 'grab' : 'default',
                  touchAction: 'none',
                }}
                onPointerDown={(e) => {
                  if (!setConfig) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const initX = config.diyImageX ?? 180;
                  const initY = config.diyImageY ?? 180;
                  const currentScale = viewportScale || 1;

                  const handlePointerMove = (moveEvent: PointerEvent) => {
                    const deltaX = (moveEvent.clientX - startX) / currentScale;
                    const deltaY = (moveEvent.clientY - startY) / currentScale;
                    const newX = Math.round(initX + deltaX);
                    const newY = Math.round(initY + deltaY);
                    setConfig((prev) => ({ ...prev, diyImageX: newX, diyImageY: newY }));
                  };

                  const handlePointerUp = () => {
                    window.removeEventListener('pointermove', handlePointerMove);
                    window.removeEventListener('pointerup', handlePointerUp);
                  };

                  window.addEventListener('pointermove', handlePointerMove);
                  window.addEventListener('pointerup', handlePointerUp);
                }}
                className="group rounded-2xl overflow-hidden hover:ring-2 hover:ring-[#FF7675] transition-all select-none"
              >
                <img
                  src={config.diyCustomImage}
                  alt="DIY Custom Element"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            )}

            {/* 2. DIY 자유 드래그 ARTIST 크레딧 박스 */}
            {config.diyShowArtist !== false && (
              <div
                style={{
                  position: 'absolute',
                  left: `${config.diyArtistX ?? 200}px`,
                  top: `${config.diyArtistY ?? 760}px`,
                  cursor: setConfig ? 'grab' : 'default',
                  touchAction: 'none',
                }}
                onPointerDown={(e) => {
                  if (!setConfig) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const initX = config.diyArtistX ?? 200;
                  const initY = config.diyArtistY ?? 760;
                  const currentScale = viewportScale || 1;

                  const handlePointerMove = (moveEvent: PointerEvent) => {
                    const deltaX = (moveEvent.clientX - startX) / currentScale;
                    const deltaY = (moveEvent.clientY - startY) / currentScale;
                    const newX = Math.round(initX + deltaX);
                    const newY = Math.round(initY + deltaY);
                    setConfig((prev) => ({ ...prev, diyArtistX: newX, diyArtistY: newY }));
                  };

                  const handlePointerUp = () => {
                    window.removeEventListener('pointermove', handlePointerMove);
                    window.removeEventListener('pointerup', handlePointerUp);
                  };

                  window.addEventListener('pointermove', handlePointerMove);
                  window.addEventListener('pointerup', handlePointerUp);
                }}
                className="group select-none px-4 py-2 rounded-xl transition-all hover:ring-1 hover:ring-[#FF7675]/60 hover:bg-white/10"
              >
                <span className="font-black text-xl tracking-wider block text-current leading-tight">
                  {config.diyArtistPrefix ?? 'ARTIST.'}
                </span>
                <span className="text-sm font-bold opacity-85 block mt-0.5">
                  {config.artByText || '그려주신분 이름'}
                </span>
              </div>
            )}

            {/* 3. 7개 요일 일정 바 리스트 드래그 */}
            {days.map((day) => {
              const x = day.diyX ?? 1000;
              const y = day.diyY ?? 200;
              const boxWidth = config.diyGlobalWidth || day.diyWidth || 460;
              const isSpecialDark = !!day.customBgColor;

              return (
                <div
                  key={day.id}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${boxWidth}px`,
                    cursor: onUpdateDayCoords ? 'grab' : 'default',
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => {
                    if (!onUpdateDayCoords) return;
                    e.preventDefault();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initialX = x;
                    const initialY = y;
                    const currentScale = viewportScale || 1;

                    const handlePointerMove = (moveEvent: PointerEvent) => {
                      const deltaX = (moveEvent.clientX - startX) / currentScale;
                      const deltaY = (moveEvent.clientY - startY) / currentScale;
                      const newX = Math.round(Math.max(0, Math.min(1920 - boxWidth, initialX + deltaX)));
                      const newY = Math.round(Math.max(0, Math.min(1080 - 60, initialY + deltaY)));
                      onUpdateDayCoords(day.id, newX, newY);
                    };

                    const handlePointerUp = () => {
                      window.removeEventListener('pointermove', handlePointerMove);
                      window.removeEventListener('pointerup', handlePointerUp);
                    };

                    window.addEventListener('pointermove', handlePointerMove);
                    window.addEventListener('pointerup', handlePointerUp);
                  }}
                  className={`group select-none transition-shadow rounded-2xl p-3.5 border ${
                    config.diyShowCardBg !== false
                      ? 'bg-white/90 backdrop-blur-md border-[#2C2825]/15 shadow-[0_6px_20px_rgba(44,40,37,0.1)]'
                      : 'bg-transparent border-transparent hover:border-dashed hover:border-[#FF7675]/60 hover:bg-white/20'
                  }`}
                >
                  {/* 드래그 가능 핸들 가이드 (호버 시 표시) */}
                  <div className="flex items-center justify-between gap-3">
                    {/* 요일 원형 뱃지 (옵션으로 켜고 끄기 가능) */}
                    {config.diyShowDayBadge !== false && (
                      <>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: day.crayonColor }}
                          >
                            {day.day}
                          </span>
                          <span
                            className={`font-mono font-bold text-xs ${
                              config.diyShowCardBg !== false ? 'text-[#5A544F]' : 'text-current'
                            }`}
                          >
                            {day.dayEnglish} {day.dateStr}
                          </span>
                        </div>

                        {/* 세로 구분선 */}
                        <div className="w-[1.5px] h-5 bg-[#2C2825]/20 shrink-0" />
                      </>
                    )}

                    {/* 메인 일정 타이틀 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black truncate ${
                            day.isOnline ? (isSpecialDark ? 'text-white' : 'text-[#2C2825]') : 'text-[#8C847D]'
                          }`}
                          style={fs(16)}
                        >
                          {day.title}
                        </span>
                        {!day.isOnline && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FF7675]/15 text-[#a83639] shrink-0">
                            휴방
                          </span>
                        )}
                      </div>
                      {day.description && day.isOnline && (
                        <p
                          className="text-[#5A544F] font-medium truncate mt-0.5"
                          style={fs(12)}
                        >
                          {day.description}
                        </p>
                      )}
                    </div>

                    {/* 방송 시간 또는 휴방 표기 */}
                    <div
                      className="shrink-0 font-bold tracking-tight text-right whitespace-nowrap pl-2"
                      style={fs(14)}
                    >
                      {day.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        ) : (
          /* ========================================================
             3. 클래식 7열 직선형 (Linear 7 Columns)
             ======================================================== */
          <main className="flex-1 my-5 grid grid-cols-7 gap-4">
            {days.map((day) => {
              const cardStyle = getCardStyle(day);
              const isSpecialDark = !!day.customBgColor;

              return (
                <div
                  key={day.id}
                  className="relative rounded-2xl p-5 border shadow-[0_4px_12px_-2px_rgba(44,40,37,0.06),0_1px_3px_rgba(44,40,37,0.04)] flex flex-col justify-between overflow-hidden"
                  style={cardStyle}
                >
                  {config.showWashiTape && (
                    <div
                      className="washi-tape absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 z-20 pointer-events-none"
                      style={{
                        transform: `translateX(-50%) rotate(${day.tapeAngle || 0}deg)`,
                      }}
                    />
                  )}

                  <div>
                    <div className="flex flex-col items-center pb-3 border-b border-[#2C2825]/5 text-center">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide text-white shadow-sm"
                        style={{ backgroundColor: day.crayonColor }}
                      >
                        {day.dayEnglish} {day.day}
                      </span>
                      <span className={`text-xs font-mono font-bold mt-1.5 ${isSpecialDark ? 'text-[#F5F2EB]' : 'text-[#5A544F]'}`}>
                        {day.dateStr}
                      </span>
                    </div>

                    <div className="my-3 flex justify-center">
                      {day.isOnline ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#55EFC4]/20 text-[#00725a] border border-[#55EFC4]/40 flex items-center gap-1">
                          <Wifi className="w-2.5 h-2.5" /> ON
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#2C2825]/10 text-[#5A544F] border border-[#2C2825]/15 flex items-center gap-1">
                          <WifiOff className="w-2.5 h-2.5" /> OFF
                        </span>
                      )}
                    </div>

                    <div className="text-center font-mono font-bold text-xs pb-2 border-b border-[#2C2825]/5 text-[#2C2825]">
                      {day.time}
                    </div>

                    <h3
                      className={`mt-3 font-bold leading-snug line-clamp-3 text-center ${isSpecialDark ? 'text-white' : 'text-[#2C2825]'}`}
                      style={fs(14)}
                    >
                      {day.title}
                    </h3>

                    <p
                      className={`mt-2 line-clamp-3 text-center leading-relaxed ${isSpecialDark ? 'text-[#e9e1dc]' : 'text-[#5A544F]'}`}
                      style={fs(12)}
                    >
                      {day.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#2C2825]/5 flex flex-col items-center gap-1 text-center">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg truncate w-full"
                      style={{
                        backgroundColor: '#F5F2EB',
                        color: '#2C2825',
                      }}
                    >
                      {day.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </main>
        )}

        {/* ========================================================
            5. 실시간 드래그 스티커 오버레이 레이어
           ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {stickers.map((st) => {
            const isSelected = selectedStickerId === st.id;

            return (
              <div
                key={st.id}
                style={{
                  position: 'absolute',
                  left: `${st.x}px`,
                  top: `${st.y}px`,
                  width: `${st.size}px`,
                  height: `${st.size}px`,
                  transform: `rotate(${st.rotation || 0}deg)`,
                  transformOrigin: 'center center',
                  touchAction: 'none',
                }}
                className={`group pointer-events-auto select-none flex items-center justify-center cursor-grab active:cursor-grabbing ${
                  isSelected ? 'ring-2 ring-[#FF7675] ring-offset-2 rounded-xl' : 'hover:ring-1 hover:ring-[#FF7675]/50 rounded-xl'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStickerId(st.id);
                }}
                onPointerDown={(e) => {
                  if (!onUpdateSticker) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedStickerId(st.id);

                  const startX = e.clientX;
                  const startY = e.clientY;
                  const initX = st.x;
                  const initY = st.y;
                  const currentScale = viewportScale || 1;

                  const handlePointerMove = (moveEvent: PointerEvent) => {
                    const deltaX = (moveEvent.clientX - startX) / currentScale;
                    const deltaY = (moveEvent.clientY - startY) / currentScale;
                    const newX = Math.round(Math.max(0, Math.min(1920 - st.size, initX + deltaX)));
                    const newY = Math.round(Math.max(0, Math.min(1080 - st.size, initY + deltaY)));
                    onUpdateSticker(st.id, { x: newX, y: newY });
                  };

                  const handlePointerUp = () => {
                    window.removeEventListener('pointermove', handlePointerMove);
                    window.removeEventListener('pointerup', handlePointerUp);
                  };

                  window.addEventListener('pointermove', handlePointerMove);
                  window.addEventListener('pointerup', handlePointerUp);
                }}
              >
                {/* 스티커 컨텐츠 (이모지 또는 이미지) */}
                {st.type === 'emoji' ? (
                  <span
                    style={{ fontSize: `${Math.round(st.size * 0.75)}px`, lineHeight: 1 }}
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  >
                    {st.content}
                  </span>
                ) : (
                  <img
                    src={st.content}
                    alt="sticker"
                    className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] pointer-events-none"
                  />
                )}

                {/* 선택 시 조작 버튼 툴바 (삭제 & 회전) */}
                {isSelected && (
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2C2825] text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-50 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 크기 줄이기 */}
                    <button
                      type="button"
                      onClick={() => onUpdateSticker?.(st.id, { size: Math.max(30, st.size - 15) })}
                      className="px-1.5 text-xs font-bold hover:text-[#FF7675]"
                      title="크기 축소"
                    >
                      -
                    </button>
                    <span className="text-[10px] font-mono opacity-70">{st.size}px</span>
                    {/* 크기 키우기 */}
                    <button
                      type="button"
                      onClick={() => onUpdateSticker?.(st.id, { size: Math.min(300, st.size + 15) })}
                      className="px-1.5 text-xs font-bold hover:text-[#55EFC4]"
                      title="크기 확대"
                    >
                      +
                    </button>
                    {/* 15도 회전 */}
                    <button
                      type="button"
                      onClick={() => onUpdateSticker?.(st.id, { rotation: ((st.rotation || 0) + 15) % 360 })}
                      className="p-1 hover:text-[#74B9FF]"
                      title="회전"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    {/* 삭제 */}
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveSticker?.(st.id);
                        setSelectedStickerId(null);
                      }}
                      className="p-1 hover:text-[#FF7675]"
                      title="스티커 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
