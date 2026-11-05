'use client';

import React, { useState } from 'react';
import { DaySchedule, ScheduleConfig, LayoutMode, TextureMode, PlacedSticker } from '@/types/schedule';
import { THEME_PRESETS, CRAYON_SWATCHES, FONT_OPTIONS, PRESET_STICKERS } from '@/data/constants';
import { getWeekDates, applyCurrentWeekDates } from '@/utils/dateUtils';
import { 
  Palette, 
  Layout, 
  Sliders, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  WifiOff, 
  Type,
  Stamp,
  Layers,
  Sparkles,
  CalendarCheck,
  Sticker,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface SidebarProps {
  config: ScheduleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ScheduleConfig>>;
  days: DaySchedule[];
  setDays: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  stickers: PlacedSticker[];
  setStickers: React.Dispatch<React.SetStateAction<PlacedSticker[]>>;
}

export const EditorSidebar: React.FC<SidebarProps> = ({
  config,
  setConfig,
  days,
  setDays,
  stickers,
  setStickers,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'style' | 'header' | 'sticker'>('schedule');
  const [expandedDayId, setExpandedDayId] = useState<string | null>('mon');

  const updateDay = (id: string, updates: Partial<DaySchedule>) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const handleSelectTheme = (themeId: string) => {
    const selectedTheme = THEME_PRESETS.find((t) => t.id === themeId);
    if (!selectedTheme) return;

    setConfig((prev) => ({
      ...prev,
      themeId: selectedTheme.id,
      customBgType: 'preset',
      customBgValue: selectedTheme.bgGradient,
      cardBgColor: selectedTheme.cardBgColor,
      cardTextColor: selectedTheme.cardTextColor,
      cardBorderColor: selectedTheme.borderColor,
    }));
  };

  return (
    <aside className="w-full lg:w-[470px] bg-[#FFFFFF] border-r border-[#E5DFD5] h-full flex flex-col shadow-sm select-none">
      
      {/* 1. 상단 바 (DESIGN.md: Clean Workbench with warm charcoal accent) */}
      <div className="p-4 border-b border-[#E5DFD5] bg-[#FBF9F5]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C2825] flex items-center justify-center text-[#FBF9F5] font-black text-sm shadow-sm">
              S
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2C2825] tracking-tight">Warm Sketchbook Studio</h2>
              <p className="text-[11px] text-[#5A544F]">디자인 에디터 & 스케줄러 메이커</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF7675]/15 text-[#FF7675] border border-[#FF7675]/30">
            {config.layoutMode === 'bento' ? 'BENTO 2.4' : 'LINEAR 7'}
          </span>
        </div>

        {/* 탭 버튼들 (4개 탭) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#F5F2EB] rounded-lg text-xs font-semibold text-[#5A544F]">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
              activeTab === 'schedule'
                ? 'bg-white text-[#2C2825] shadow-sm font-bold'
                : 'hover:text-[#2C2825]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" /> <span className="truncate">일정</span>
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
              activeTab === 'style'
                ? 'bg-white text-[#2C2825] shadow-sm font-bold'
                : 'hover:text-[#2C2825]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> <span className="truncate">테마</span>
          </button>
          <button
            onClick={() => setActiveTab('sticker')}
            className={`py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
              activeTab === 'sticker'
                ? 'bg-white text-[#2C2825] shadow-sm font-bold'
                : 'hover:text-[#2C2825]'
            }`}
          >
            <Sticker className="w-3.5 h-3.5 text-[#FF7675]" /> <span className="truncate font-bold text-[#FF7675]">스티커</span>
          </button>
          <button
            onClick={() => setActiveTab('header')}
            className={`py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${
              activeTab === 'header'
                ? 'bg-white text-[#2C2825] shadow-sm font-bold'
                : 'hover:text-[#2C2825]'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> <span className="truncate">헤더</span>
          </button>
        </div>
      </div>

      {/* 스크롤 가능한 본문 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* 탭 1: 요일별 일정 & 온오프라인 상태 */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-[#2C2825] flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#FF7675]" /> 월~일 요일별 일정 및 크레용 스와치
              </span>
              <button
                type="button"
                onClick={() => {
                  const weekInfo = getWeekDates();
                  setDays((prev) => applyCurrentWeekDates(prev));
                  setConfig((prev) => ({
                    ...prev,
                    headerSubtitle: weekInfo.headerSubtitle,
                    weekNumber: weekInfo.weekNumber,
                  }));
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-[#FF7675] hover:text-[#d63031] bg-[#FF7675]/10 hover:bg-[#FF7675]/20 px-2 py-1 rounded-md transition-all cursor-pointer"
                title="오늘 기준 이번 주 월~일 날짜로 일괄 업데이트"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> 이번 주 날짜로 맞추기
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('모든 요일을 OFFLINE(휴방) 상태로 일괄 변경하시겠습니까?')) {
                    setDays((prev) =>
                      prev.map((d) => ({
                        ...d,
                        isOnline: false,
                        time: '휴방',
                        title: 'OFFLINE',
                        description: '',
                        badge: 'REST',
                        footerNote: 'RECHARGE DAY',
                        tagIcon: 'sleep',
                      }))
                    );
                  }
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-[#5A544F] hover:text-[#2C2825] bg-[#F5F2EB] hover:bg-[#E5DFD5] px-2 py-1 rounded-md transition-all cursor-pointer"
                title="전체 요일을 OFFLINE 휴방 양식으로 일괄 전환"
              >
                전체 휴방
              </button>
            </div>

            <div className="space-y-2.5">
              {days.map((day) => {
                const isExpanded = expandedDayId === day.id;

                return (
                  <div
                    key={day.id}
                    className="border border-[#E5DFD5] rounded-xl overflow-hidden bg-[#FBF9F5] transition-all hover:border-[#8C847D]"
                  >
                    {/* 아코디언 헤더 */}
                    <div
                      onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                      className="p-3 bg-white flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: day.crayonColor }}
                        >
                          {day.day}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#2C2825] mr-2">
                            {day.dateStr} ({day.dayEnglish})
                          </span>
                          <span className="text-[11px] text-[#5A544F] truncate max-w-[150px] inline-block align-bottom">
                            {day.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {day.isOnline ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#55EFC4]/20 text-[#00725a] border border-[#55EFC4]/40">
                            ON
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF7675]/15 text-[#a83639] border border-[#FF7675]/30">
                            OFF
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#8C847D]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#8C847D]" />
                        )}
                      </div>
                    </div>

                    {/* 아코디언 세부 내용 */}
                    {isExpanded && (
                      <div className="p-4 bg-[#FBF9F5] border-t border-[#E5DFD5] space-y-3.5 text-xs">
                        
                        {/* 벤토 스페셜 대형 카드 (와이드 2칸) 지정 토글 */}
                        {config.layoutMode === 'bento' && (
                          <div className="p-2.5 rounded-xl border border-[#E5DFD5] bg-white flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#2C2825] flex items-center gap-1.5 text-xs">
                                <Sparkles className="w-3.5 h-3.5 text-[#FF7675]" /> 이 요일을 대형 카드(와이드 2칸)로 강조
                              </span>
                              <span className="text-[10px] text-[#8C847D]">
                                벤토 그리드에서 가장 큰 메인 카드로 표시됩니다.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                // 다른 요일의 isFeatured는 false로 하고 현재 요일만 true로 설정
                                setDays((prev) =>
                                  prev.map((d) => ({
                                    ...d,
                                    isFeatured: d.id === day.id,
                                  }))
                                );
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                day.isFeatured
                                  ? 'bg-[#2C2825] text-white shadow-sm'
                                  : 'bg-[#F5F2EB] text-[#5A544F] hover:bg-[#E5DFD5]'
                              }`}
                            >
                              {day.isFeatured ? '★ 강조 적용됨' : '선택하기'}
                            </button>
                          </div>
                        )}

                        {/* 방송/일정 상태 전환 (Online / Offline 토글) */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#2C2825] mb-1.5">
                            방송 / 일정 상태 (Online / Offline)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                updateDay(day.id, {
                                  isOnline: true,
                                  time: day.time === '휴방' ? '19:00 KST' : day.time,
                                  title: day.title === 'OFFLINE' ? '방송 일정' : day.title,
                                  badge: day.badge === 'REST' ? '소통' : day.badge,
                                  footerNote: day.footerNote === 'RECHARGE DAY' ? 'Live Stream' : day.footerNote,
                                  tagIcon: day.tagIcon === 'sleep' ? 'chat' : day.tagIcon,
                                });
                              }}
                              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all ${
                                day.isOnline
                                  ? 'bg-[#2C2825] text-[#FBF9F5] shadow-sm'
                                  : 'bg-white border border-[#E5DFD5] text-[#5A544F] hover:bg-[#F5F2EB]'
                              }`}
                            >
                              <Wifi className="w-3.5 h-3.5 text-[#55EFC4]" /> ONLINE 방송
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateDay(day.id, {
                                  isOnline: false,
                                  time: '휴방',
                                  title: 'OFFLINE',
                                  description: '',
                                  badge: 'REST',
                                  footerNote: 'RECHARGE DAY',
                                  tagIcon: 'sleep',
                                });
                              }}
                              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all ${
                                !day.isOnline
                                  ? 'bg-[#FF7675] text-white shadow-sm'
                                  : 'bg-white border border-[#E5DFD5] text-[#5A544F] hover:bg-[#F5F2EB]'
                              }`}
                            >
                              <WifiOff className="w-3.5 h-3.5" /> OFFLINE 휴방
                            </button>
                          </div>
                        </div>

                        {/* 크레용 스와치 선택기 (DESIGN.md: Crayon Swatches) */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#2C2825] mb-1.5">
                            크레용 액센트 컬러 스와치
                          </label>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {CRAYON_SWATCHES.map((swatch) => (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => updateDay(day.id, { crayonColor: swatch.hex })}
                                className={`w-6 h-6 rounded-full transition-transform shrink-0 ${
                                  day.crayonColor === swatch.hex
                                    ? 'ring-2 ring-offset-2 ring-[#2C2825] scale-110'
                                    : 'hover:scale-105 opacity-80'
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                                title={swatch.name}
                              />
                            ))}
                          </div>
                        </div>

                        {/* 날짜 & 시간 */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                              날짜 표기
                            </label>
                            <input
                              type="text"
                              value={day.dateStr}
                              onChange={(e) => updateDay(day.id, { dateStr: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-mono font-medium focus:border-[#2C2825] outline-none"
                              placeholder="03.17"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                              시간 표기
                            </label>
                            <input
                              type="text"
                              value={day.time}
                              onChange={(e) => updateDay(day.id, { time: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-mono font-medium focus:border-[#2C2825] outline-none"
                              placeholder="19:00 KST"
                            />
                          </div>
                        </div>

                        {/* 메인 일정 타이틀 */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                            메인 일정 타이틀
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateDay(day.id, { title: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-semibold focus:border-[#2C2825] outline-none"
                            placeholder="일정 제목"
                          />
                        </div>

                        {/* 세부 메모 & 설명 */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                            세부 내용 및 메모
                          </label>
                          <textarea
                            value={day.description}
                            onChange={(e) => updateDay(day.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-medium focus:border-[#2C2825] outline-none resize-none"
                            placeholder="상세 내용을 적어주세요"
                          />
                        </div>

                        {/* 카테고리 뱃지 & 하단 라벨 */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                              상단 카테고리 뱃지
                            </label>
                            <input
                              type="text"
                              value={day.badge}
                              onChange={(e) => updateDay(day.id, { badge: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-medium focus:border-[#2C2825] outline-none"
                              placeholder="종합게임, 저챗 등"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#5A544F] mb-1">
                              하단 푸터 태그
                            </label>
                            <input
                              type="text"
                              value={day.footerNote || ''}
                              onChange={(e) => updateDay(day.id, { footerNote: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-medium focus:border-[#2C2825] outline-none"
                              placeholder="특별 매치 등"
                            />
                          </div>
                        </div>

                        {/* 요일별 박스 개별 투명도 조절 (Opacity) */}
                        <div className="pt-2 border-t border-[#E5DFD5]">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[11px] font-bold text-[#2C2825] flex items-center gap-1">
                              <Sliders className="w-3.5 h-3.5 text-[#FF7675]" /> 이 요일 박스만 개별 투명도 조절
                            </label>
                            <span className="text-[11px] font-mono font-bold text-[#2C2825]">
                              {day.customOpacity !== undefined ? `${day.customOpacity}%` : `기본값 (${config.cardBgOpacity}%)`}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={day.customOpacity !== undefined ? day.customOpacity : config.cardBgOpacity}
                            onChange={(e) => updateDay(day.id, { customOpacity: Number(e.target.value) })}
                            className="w-full h-1.5 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#2C2825]"
                          />
                          {day.customOpacity !== undefined && (
                            <button
                              type="button"
                              onClick={() => updateDay(day.id, { customOpacity: undefined })}
                              className="mt-1 text-[10px] text-[#5A544F] hover:underline"
                            >
                              ↺ 전체 공통 투명도로 되돌리기
                            </button>
                          )}
                        </div>

                        {/* 전용 커스텀 배경색 (선택사항) */}
                        <div className="pt-2 border-t border-[#E5DFD5]">
                          <label className="block text-[11px] font-bold text-[#2C2825] mb-1.5">
                            특정 요일 전용 배경색 (다크 하이라이트용)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={day.customBgColor || '#2C2825'}
                              onChange={(e) => updateDay(day.id, { customBgColor: e.target.value, customTextColor: '#FFFFFF' })}
                              className="w-7 h-7 rounded border border-[#E5DFD5] cursor-pointer"
                            />
                            <span className="text-[11px] text-[#5A544F] font-mono">
                              {day.customBgColor || '기본 종이 배경 적용'}
                            </span>
                            {day.customBgColor && (
                              <button
                                type="button"
                                onClick={() => updateDay(day.id, { customBgColor: undefined, customTextColor: undefined })}
                                className="ml-auto text-[11px] text-[#FF7675] hover:underline font-bold"
                              >
                                초기화
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 탭 2: 스타일 & 테마 탭 (DESIGN.md Paper Metaphors) */}
        {activeTab === 'style' && (
          <div className="space-y-6">
            
            {/* 레이아웃 프리셋 */}
            <div>
              <label className="block text-xs font-bold text-[#2C2825] mb-2 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-[#FF7675]" /> 스케줄 레이아웃 모드
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, layoutMode: 'bento' }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config.layoutMode === 'bento'
                      ? 'border-[#2C2825] bg-[#F5F2EB] font-bold text-[#2C2825] shadow-sm'
                      : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:border-[#8C847D]'
                  }`}
                >
                  <div className="text-xs font-bold">스크랩북 벤토</div>
                  <div className="text-[10px] text-[#8C847D] mt-0.5">2열 비대칭 와이드</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, layoutMode: 'linear' }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config.layoutMode === 'linear'
                      ? 'border-[#2C2825] bg-[#F5F2EB] font-bold text-[#2C2825] shadow-sm'
                      : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:border-[#8C847D]'
                  }`}
                >
                  <div className="text-xs font-bold">7열 클래식</div>
                  <div className="text-[10px] text-[#8C847D] mt-0.5">가로 7분할 나열</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, layoutMode: 'notebook' }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config.layoutMode === 'notebook'
                      ? 'border-[#2C2825] bg-[#F5F2EB] font-bold text-[#2C2825] shadow-sm'
                      : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:border-[#8C847D]'
                  }`}
                >
                  <div className="text-xs font-bold">모눈종이 노트</div>
                  <div className="text-[10px] text-[#8C847D] mt-0.5">일러스트/캐릭터용</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, layoutMode: 'polaroid' }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    config.layoutMode === 'polaroid'
                      ? 'border-[#2C2825] bg-[#F5F2EB] font-bold text-[#2C2825] shadow-sm'
                      : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:border-[#8C847D]'
                  }`}
                >
                  <div className="text-xs font-bold">밤하늘 폴라로이드</div>
                  <div className="text-[10px] text-[#8C847D] mt-0.5">액자 프레임 & 캡슐 바</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, layoutMode: 'custom_diy' }))}
                  className={`p-2.5 rounded-xl border text-left transition-all col-span-2 ${
                    config.layoutMode === 'custom_diy'
                      ? 'border-[#FF7675] bg-[#FF7675]/10 font-bold text-[#a83639] shadow-sm ring-2 ring-[#FF7675]/20'
                      : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:border-[#FF7675]/50'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>자유 틀 템플릿 (DIY 드래그 배치)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF7675] text-white font-mono">NEW</span>
                  </div>
                  <div className="text-[10px] text-[#8C847D] mt-0.5">
                    원하는 틀 사진을 올리고, 마우스로 각 요일 글자 위치를 자유롭게 끌어서 맞춤
                  </div>
                </button>
              </div>

              {/* DIY 모드 전용 옵션 */}
              {config.layoutMode === 'custom_diy' && (
                <div className="mt-3 p-3.5 bg-[#FFF0F0] border-2 border-[#FF7675]/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2825] flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-[#FF7675]" /> DIY 자유 배치 모드 설정
                    </span>
                    <span className="text-[10px] text-[#FF7675] font-bold">드래그 지원</span>
                  </div>
                  <p className="text-[11px] text-[#5A544F] leading-relaxed">
                    캔버스에서 각 요일 일정을 마우스나 터치로 끌어서 원하는 틀의 빈칸 위치에 맞추세요.
                  </p>

                  {/* 반투명 카드 박스 토글 */}
                  <div className="pt-2 border-t border-[#FF7675]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#2C2825] block">반투명 카드 박스 표시</span>
                      <span className="text-[9px] text-[#8C847D]">끄면 글자만 깔끔하게 틀 위에 얹어집니다</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.diyShowCardBg !== false}
                      onChange={(e) => setConfig((prev) => ({ ...prev, diyShowCardBg: e.target.checked }))}
                      className="w-4 h-4 accent-[#2C2825] cursor-pointer"
                    />
                  </div>

                  {/* 요일 원형 뱃지 및 영문명 표시 토글 */}
                  <div className="pt-2 border-t border-[#FF7675]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#2C2825] block">요일 뱃지 (월, 화, WED 등) 표시</span>
                      <span className="text-[9px] text-[#8C847D]">틀 배경에 이미 요일이 적혀있다면 체크를 끄세요</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.diyShowDayBadge !== false}
                      onChange={(e) => setConfig((prev) => ({ ...prev, diyShowDayBadge: e.target.checked }))}
                      className="w-4 h-4 accent-[#2C2825] cursor-pointer"
                    />
                  </div>

                  {/* 상단 헤더 (Weekly Schedule, 기간/주차, 공지) 표시 토글 */}
                  <div className="pt-2 border-t border-[#FF7675]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#2C2825] block">상단 헤더 (Weekly 타이틀 & 기간/주차) 표시</span>
                      <span className="text-[9px] text-[#8C847D]">틀 배경에 이미 제목/SCHEDULE이 있다면 끄세요</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.diyShowHeader !== false}
                      onChange={(e) => setConfig((prev) => ({ ...prev, diyShowHeader: e.target.checked }))}
                      className="w-4 h-4 accent-[#2C2825] cursor-pointer"
                    />
                  </div>

                  {/* ARTIST 크레딧 박스 토글 & 이름 설정 */}
                  <div className="pt-2 border-t border-[#FF7675]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#2C2825] block">ARTIST 이름 박스 표시</span>
                        <span className="text-[9px] text-[#8C847D]">마우스로 원하는 위치로 자유롭게 드래그 가능</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.diyShowArtist !== false}
                        onChange={(e) => setConfig((prev) => ({ ...prev, diyShowArtist: e.target.checked }))}
                        className="w-4 h-4 accent-[#2C2825] cursor-pointer"
                      />
                    </div>
                    {config.diyShowArtist !== false && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5A544F] mb-0.5">접두사 라벨</label>
                          <input
                            type="text"
                            value={config.diyArtistPrefix ?? 'ARTIST.'}
                            onChange={(e) => setConfig((prev) => ({ ...prev, diyArtistPrefix: e.target.value }))}
                            placeholder="ARTIST. 또는 Art By."
                            className="w-full px-2.5 py-1 bg-white border border-[#E5DFD5] rounded-md text-xs font-bold text-[#2C2825] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5A544F] mb-0.5">작가/그려주신분 이름</label>
                          <input
                            type="text"
                            value={config.artByText || ''}
                            onChange={(e) => setConfig((prev) => ({ ...prev, artByText: e.target.value }))}
                            placeholder="이름 입력"
                            className="w-full px-2.5 py-1 bg-white border border-[#E5DFD5] rounded-md text-xs font-bold text-[#2C2825] outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DIY 커스텀 이미지 (캐릭터/일러스트 사진) 별도 추가 기능 */}
                  <div className="pt-2 border-t border-[#FF7675]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#2C2825] block">틀 위에 얹을 일러스트/사진 추가</span>
                      {config.diyCustomImage && (
                        <button
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, diyCustomImage: null }))}
                          className="text-[10px] text-[#FF7675] hover:underline font-bold"
                        >
                          사진 삭제
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8C847D]">
                      틀 이미지 위에 스트리머 캐릭터나 일러스트를 올려서 마우스로 자유롭게 위치를 맞출 수 있습니다.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setConfig((prev) => ({
                              ...prev,
                              diyCustomImage: event.target?.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }
                      }}
                      className="text-xs text-[#5A544F] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#2C2825] file:text-white cursor-pointer w-full"
                    />

                    {config.diyCustomImage && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="text-[10px] font-semibold text-[#5A544F]">사진 가로 크기</label>
                            <span className="text-[10px] font-mono">{config.diyImageWidth || 580}px</span>
                          </div>
                          <input
                            type="range"
                            min="200"
                            max="1200"
                            step="10"
                            value={config.diyImageWidth || 580}
                            onChange={(e) => setConfig((prev) => ({ ...prev, diyImageWidth: Number(e.target.value) }))}
                            className="w-full h-1 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#FF7675]"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="text-[10px] font-semibold text-[#5A544F]">사진 세로 크기</label>
                            <span className="text-[10px] font-mono">{config.diyImageHeight || 560}px</span>
                          </div>
                          <input
                            type="range"
                            min="200"
                            max="1000"
                            step="10"
                            value={config.diyImageHeight || 560}
                            onChange={(e) => setConfig((prev) => ({ ...prev, diyImageHeight: Number(e.target.value) }))}
                            className="w-full h-1 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#FF7675]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#FF7675]/20">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-[#2C2825]">요일 박스 너비 조절</label>
                      <span className="text-[11px] font-mono text-[#5A544F]">{config.diyGlobalWidth || 460}px</span>
                    </div>
                    <input
                      type="range"
                      min="280"
                      max="700"
                      step="10"
                      value={config.diyGlobalWidth || 460}
                      onChange={(e) => setConfig((prev) => ({ ...prev, diyGlobalWidth: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#FF7675]"
                    />
                  </div>
                </div>
              )}

              {/* 폴라로이드 모드 전용 사진 업로드 & 작가명 옵션 */}
              {config.layoutMode === 'polaroid' && (
                <div className="mt-3 p-3 bg-[#F5F2EB] border border-[#E5DFD5] rounded-xl space-y-3">
                  <span className="text-[11px] font-bold text-[#2C2825] block">
                    폴라로이드 액자 사진 & 크레딧
                  </span>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A544F] mb-1">
                      액자 전용 사진 업로드 (선택사항)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setConfig((prev) => ({
                              ...prev,
                              polaroidPhoto: event.target?.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-[#5A544F] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#2C2825] file:text-white cursor-pointer"
                    />
                    {config.polaroidPhoto && (
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, polaroidPhoto: null }))}
                        className="mt-1 text-[10px] text-[#FF7675] hover:underline"
                      >
                        사진 제거
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#5A544F] mb-1">
                      ARTIST. 크레딧 이름
                    </label>
                    <input
                      type="text"
                      value={config.artByText || ''}
                      onChange={(e) => setConfig((prev) => ({ ...prev, artByText: e.target.value }))}
                      placeholder="그려주신분 이름 / 작가명"
                      className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-xs font-bold text-[#2C2825] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 모눈종이 노트 모드일 때 전용 옵션 */}
              {config.layoutMode === 'notebook' && (
                <div className="mt-3 p-3 bg-[#F5F2EB] border border-[#E5DFD5] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2C2825]">스케줄 표 배치 위치</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, notebookAlign: 'right' }))}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                          config.notebookAlign !== 'left'
                            ? 'bg-[#2C2825] text-white'
                            : 'bg-white text-[#5A544F] border border-[#E5DFD5]'
                        }`}
                      >
                        우측 (좌측 캐릭터)
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, notebookAlign: 'left' }))}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                          config.notebookAlign === 'left'
                            ? 'bg-[#2C2825] text-white'
                            : 'bg-white text-[#5A544F] border border-[#E5DFD5]'
                        }`}
                      >
                        좌측 (우측 캐릭터)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2C2825] mb-1">
                      Art By 크레딧 이름
                    </label>
                    <input
                      type="text"
                      value={config.artByText || ''}
                      onChange={(e) => setConfig((prev) => ({ ...prev, artByText: e.target.value }))}
                      placeholder="그려주신분 이름 / 작가명"
                      className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-xs font-bold text-[#2C2825] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DESIGN.md: 테마 프리셋 */}
            <div>
              <label className="block text-xs font-bold text-[#2C2825] mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#FF7675]" /> 스케치북 테마 프리셋
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEME_PRESETS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      handleSelectTheme(theme.id);
                      // 프리셋 선택 시 사용자 커스텀 이미지 해제
                      setConfig((prev) => ({ ...prev, userBgImage: null }));
                    }}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                      config.themeId === theme.id && !config.userBgImage
                        ? 'border-[#2C2825] bg-[#F5F2EB] font-bold text-[#2C2825] shadow-sm'
                        : 'border-[#E5DFD5] hover:border-[#8C847D] text-[#5A544F]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                      style={{ background: theme.previewColor }}
                    />
                    <span className="text-[11px] truncate">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 사용자 커스텀 배경 이미지 업로드 및 맞춤/확대 옵션 */}
            <div className="p-4 bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C2825] flex items-center gap-1.5">
                  <span className="text-[#FF7675]">🖼️</span> 나만의 배경 이미지 업로드
                </label>
                {config.userBgImage && (
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, userBgImage: null }))}
                    className="text-[11px] text-[#FF7675] hover:underline font-bold"
                  >
                    이미지 제거
                  </button>
                )}
              </div>

              {/* 파일 업로드 인풋 */}
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5DFD5] hover:border-[#2C2825] rounded-xl p-4 cursor-pointer transition-colors bg-[#FBF9F5]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (result) {
                          setConfig((prev) => ({
                            ...prev,
                            userBgImage: result,
                          }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="text-xs font-bold text-[#2C2825] mb-0.5">
                  {config.userBgImage ? '✓ 새 이미지로 변경하기' : '+ 이미지 파일 선택 (JPG, PNG)'}
                </span>
                <span className="text-[10px] text-[#8C847D]">
                  16:9 비율(1920×1080) 권장 / 모든 비율 이미지 지원
                </span>
              </label>

              {/* 이미지 크기/맞춤 방식 선택 (16:9가 아닐 경우 또는 맞춤 방식) */}
              {config.userBgImage && (
                <div className="pt-2 border-t border-[#E5DFD5] space-y-2">
                  <span className="block text-[11px] font-bold text-[#2C2825]">
                    배경 크기 맞춤 방식
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, bgImageSizeMode: 'cover' }))}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                        config.bgImageSizeMode === 'cover'
                          ? 'border-[#2C2825] bg-[#2C2825] text-white shadow-sm'
                          : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      확대 (꽉 채움)
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, bgImageSizeMode: 'contain' }))}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                        config.bgImageSizeMode === 'contain'
                          ? 'border-[#2C2825] bg-[#2C2825] text-white shadow-sm'
                          : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      맞춤 (비율 유지)
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, bgImageSizeMode: 'fill' }))}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition-all ${
                        config.bgImageSizeMode === 'fill'
                          ? 'border-[#2C2825] bg-[#2C2825] text-white shadow-sm'
                          : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      16:9 전체 맞춤
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8C847D]">
                    {config.bgImageSizeMode === 'cover' && '• 여백 없이 16:9 전체 영역을 꽉 채웁니다.'}
                    {config.bgImageSizeMode === 'contain' && '• 원본 사진의 비율을 유지하며 화면 안에 온전히 맞춥니다.'}
                    {config.bgImageSizeMode === 'fill' && '• 16:9 비율(1920×1080)에 화면을 1:1로 맞춥니다.'}
                  </p>
                </div>
              )}
            </div>

            {/* DESIGN.md 질감 텍스처 (Grid / Grain / Plain) */}
            <div>
              <label className="block text-xs font-bold text-[#2C2825] mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#FF7675]" /> 캔버스 종이 질감
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['plain', 'grid', 'grain'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, textureMode: mode }))}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-all ${
                      config.textureMode === mode
                        ? 'border-[#2C2825] bg-[#2C2825] text-white shadow-sm'
                        : 'border-[#E5DFD5] bg-white text-[#5A544F] hover:bg-[#F5F2EB]'
                    }`}
                  >
                    {mode === 'plain' ? '일반 스무스' : mode === 'grid' ? '모눈 종이' : '미세 그레인'}
                  </button>
                ))}
              </div>
            </div>

            {/* 핵심 기능: 요일별 박스 투명도 조절 (Opacity) 슬라이더 */}
            <div className="p-4 bg-[#F5F2EB] rounded-xl border border-[#E5DFD5] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C2825] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF7675]" /> 박스 배경 투명도 (Opacity)
                </label>
                <span className="text-xs font-mono font-bold text-[#2C2825]">
                  {config.cardBgOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={config.cardBgOpacity}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, cardBgOpacity: Number(e.target.value) }))
                }
                className="w-full h-2 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#2C2825]"
              />
              <p className="text-[11px] text-[#5A544F] leading-relaxed">
                텍스트와 일정 내용은 선명하게 유지되며 박스의 배경색 투명도만 조절합니다.
              </p>
            </div>

            {/* 전체 스케줄러 폰트/글씨체 선택 */}
            <div className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C2825] flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#FF7675]" /> 스케줄러 글씨체 (폰트)
                </label>
                <span className="text-[10px] text-[#8C847D] font-mono">5종 인기 한글 폰트</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, selectedFont: font.fontFamily }))}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      config.selectedFont === font.fontFamily
                        ? 'border-[#2C2825] bg-[#F5F2EB] shadow-sm'
                        : 'border-[#E5DFD5] bg-[#FBF9F5] hover:border-[#8C847D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#2C2825]">{font.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#5A544F] border border-[#E5DFD5]">
                        {font.category}
                      </span>
                    </div>
                    <div
                      className="text-sm text-[#2C2825] truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.previewText} (19:00 KST 라이브 방송)
                    </div>
                  </button>
                ))}
              </div>

              {/* 글씨체 크기 조절 슬라이더 */}
              <div className="pt-3 border-t border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#2C2825]">
                    전체 글씨체 크기 비율 (Font Size)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#2C2825]">
                      {config.fontSizeScale || 100}%
                    </span>
                    {(config.fontSizeScale && config.fontSizeScale !== 100) && (
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, fontSizeScale: 100 }))}
                        className="text-[10px] text-[#FF7675] hover:underline font-bold"
                      >
                        (100% 초기화)
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="75"
                  max="135"
                  step="5"
                  value={config.fontSizeScale || 100}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, fontSizeScale: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-[#E5DFD5] rounded-lg appearance-none cursor-pointer accent-[#2C2825]"
                />
                <div className="flex justify-between text-[10px] text-[#8C847D] font-mono">
                  <span>작게 (75%)</span>
                  <span>보통 (100%)</span>
                  <span>크게 (135%)</span>
                </div>
              </div>
            </div>

            {/* 마스킹 테이프 & 장식 토글 */}
            <div className="p-3 bg-white border border-[#E5DFD5] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#2C2825] block">마스킹 테이프 핀 장식</span>
                <span className="text-[10px] text-[#8C847D]">카드 상단 Washi Tape 연출</span>
              </div>
              <input
                type="checkbox"
                checked={config.showWashiTape}
                onChange={(e) => setConfig((prev) => ({ ...prev, showWashiTape: e.target.checked }))}
                className="w-4 h-4 accent-[#2C2825] cursor-pointer"
              />
            </div>

          </div>
        )}

        {/* 탭 3: 스티커 꾸미기 탭 */}
        {activeTab === 'sticker' && (
          <div className="space-y-5 text-xs">
            {/* 기본 스티커 팔레트 */}
            <div className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C2825] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF7675]" /> 기본 프리셋 스티커
                </span>
                <span className="text-[10px] text-[#8C847D]">클릭 시 화면에 추가</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_STICKERS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      const newSticker: PlacedSticker = {
                        id: 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        type: 'emoji',
                        content: st.content,
                        x: 960 - 40,
                        y: 540 - 40,
                        size: 70,
                        rotation: 0,
                      };
                      setStickers((prev) => [...prev, newSticker]);
                    }}
                    className="p-2.5 bg-[#FBF9F5] hover:bg-[#F5F2EB] border border-[#E5DFD5] hover:border-[#2C2825] rounded-xl flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer"
                  >
                    <span className="text-2xl group-hover:scale-115 transition-transform">{st.content}</span>
                    <span className="text-[10px] font-medium text-[#5A544F]">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 사용자 커스텀 PNG 스티커 업로드 */}
            <div className="p-4 bg-white border border-[#E5DFD5] rounded-xl space-y-3">
              <span className="font-bold text-[#2C2825] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#FF7675]" /> 나만의 PNG 스티커 업로드
              </span>
              <p className="text-[11px] text-[#5A544F]">
                투명 배경(PNG)의 캐릭터 도트, 배지, 싸인, 팬아트 스티커를 올려서 스케줄표에 자유롭게 붙일 수 있습니다.
              </p>
              <div>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2C2825] hover:bg-[#1E1B18] text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm transition-all">
                  <Plus className="w-4 h-4 text-[#FF7675]" />
                  PNG 스티커 파일 추가
                  <input
                    type="file"
                    accept="image/png, image/webp, image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          const newSticker: PlacedSticker = {
                            id: 'custom_stk_' + Date.now(),
                            type: 'image',
                            content: base64,
                            x: 960 - 60,
                            y: 540 - 60,
                            size: 110,
                            rotation: 0,
                          };
                          setStickers((prev) => [...prev, newSticker]);
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* 현재 부착된 스티커 목록 & 관리 */}
            <div className="p-4 bg-[#F5F2EB] border border-[#E5DFD5] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C2825]">부착된 스티커 목록 ({stickers.length}개)</span>
                {stickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('캔버스에 부착된 모든 스티커를 지우시겠습니까?')) {
                        setStickers([]);
                      }
                    }}
                    className="text-[10px] text-[#FF7675] hover:underline font-bold"
                  >
                    전체 삭제
                  </button>
                )}
              </div>

              {stickers.length === 0 ? (
                <p className="text-[11px] text-[#8C847D] py-2 text-center">
                  아직 부착된 스티커가 없습니다. 위에서 스티커를 추가해 보세요!
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {stickers.map((st, idx) => (
                    <div
                      key={st.id}
                      className="p-2 bg-white rounded-lg border border-[#E5DFD5] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {st.type === 'emoji' ? (
                          <span className="text-lg">{st.content}</span>
                        ) : (
                          <img src={st.content} alt="stk" className="w-6 h-6 object-contain" />
                        )}
                        <span className="font-medium text-[#2C2825]">
                          스티커 #{idx + 1} ({st.size}px)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStickers((prev) => prev.filter((s) => s.id !== st.id))}
                        className="text-[#8C847D] hover:text-[#FF7675] p-1"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 탭 4: 헤더 & 정보 탭 */}
        {activeTab === 'header' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2C2825] mb-1">스케줄러 메인 타이틀</label>
              <input
                type="text"
                value={config.headerTitle}
                onChange={(e) => setConfig((prev) => ({ ...prev, headerTitle: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-lg text-[#2C2825] font-semibold focus:border-[#2C2825] outline-none"
              />
            </div>

            <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#E5DFD5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C2825] flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-[#FF7675]" /> 이번 주 날짜로 자동 동기화
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const weekInfo = getWeekDates();
                    setDays((prev) => applyCurrentWeekDates(prev));
                    setConfig((prev) => ({
                      ...prev,
                      headerSubtitle: weekInfo.headerSubtitle,
                      weekNumber: weekInfo.weekNumber,
                    }));
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-[#2C2825] text-[#2C2825] hover:text-white border border-[#E5DFD5] rounded-md font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                >
                  지금 동기화
                </button>
              </div>
              <p className="text-[10px] text-[#8C847D]">
                오늘 날짜를 기준으로 이번 주 월~일 날짜, 연도/기간, 주차 뱃지를 일괄 계산하여 적용합니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#5A544F] mb-1">날짜 기간</label>
                <input
                  type="text"
                  value={config.headerSubtitle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, headerSubtitle: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-mono font-medium focus:border-[#2C2825] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5A544F] mb-1">주차 뱃지</label>
                <input
                  type="text"
                  value={config.weekNumber}
                  onChange={(e) => setConfig((prev) => ({ ...prev, weekNumber: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5DFD5] rounded-md text-[#2C2825] font-medium focus:border-[#2C2825] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2C2825] mb-1">공지사항 티커 (Notice)</label>
              <textarea
                value={config.noticeText}
                onChange={(e) => setConfig((prev) => ({ ...prev, noticeText: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-lg text-[#2C2825] font-medium focus:border-[#2C2825] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2C2825] mb-1">채널/플랫폼 태그</label>
              <input
                type="text"
                value={config.channelTags}
                onChange={(e) => setConfig((prev) => ({ ...prev, channelTags: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-[#E5DFD5] rounded-lg text-[#2C2825] font-mono font-medium focus:border-[#2C2825] outline-none"
              />
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
