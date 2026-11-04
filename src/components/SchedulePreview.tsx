'use client';

import React from 'react';
import { DaySchedule, ScheduleConfig } from '@/types/schedule';
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
  WifiOff 
} from 'lucide-react';

interface PreviewProps {
  config: ScheduleConfig;
  days: DaySchedule[];
  previewRef?: React.RefObject<HTMLDivElement | null>;
  showGridLines?: boolean;
}

export const SchedulePreview: React.FC<PreviewProps> = ({
  config,
  days,
  previewRef,
  showGridLines = false,
}) => {
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

        {/* ========================================================
            2. 메인 스케줄 영역 (Bento 또는 Linear)
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

      </div>
    </div>
  );
};
