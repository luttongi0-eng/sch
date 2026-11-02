export interface DaySchedule {
  id: string;
  day: string; // 월, 화, 수, 목, 금, 토, 일
  dayEnglish: string; // MON, TUE, WED / Monday, etc.
  dateStr: string; // 03.17, etc.
  isOnline: boolean;
  time: string; // "19:00", "20:00 KST"
  badge: string; // "종합게임", "Just Chatting", "특별 합방", "REST" 등
  crayonColor: string; // #FF7675, #FDCB6E, #55EFC4, #74B9FF, #A29BFE, #FAB1A0
  title: string; // 메인 제목
  description: string; // 세부 메모 또는 서브 타이틀
  footerNote?: string; // 카드 하단 문구
  tagIcon?: string; // "game", "chat", "sparkle", "sleep", "audio"
  customBgColor?: string; // 특정 요일 전용 커스텀 배경색 (선택사항)
  customTextColor?: string; // 특정 요일 전용 커스텀 폰트색 (선택사항)
  customOpacity?: number; // 특정 요일 박스 구역 전용 투명도 (선택사항, 0~100)
  tapeAngle?: number; // 마스킹 테이프 회전 각도 (-1.5 ~ 1.5 deg)
  isFeatured?: boolean; // 벤토 레이아웃에서 2칸 와이드로 크게 강조할 요일 여부
}

export type LayoutMode = 'bento' | 'linear';
export type TextureMode = 'grain' | 'grid' | 'plain';
export type ImageSizeMode = 'cover' | 'contain' | 'fill'; // 확대(꽉 채움) / 맞춤(비율유지) / 늘리기

export interface ThemePreset {
  id: string;
  name: string;
  previewColor: string;
  bgGradient: string;
  cardBgColor: string; // hex
  cardTextColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface ScheduleConfig {
  headerTitle: string; // "Weekly Schedule"
  headerSubtitle: string; // "2025 | 03.17 ~ 03.23"
  weekNumber: string; // "3월 3주차"
  noticeText: string; // "목요일 공포 탈출 3인 합방 & 토요일 치킨 5마리 내전!"
  channelTags: string; // "CHZZK / TWITCH / YT"
  layoutMode: LayoutMode; // 'bento' | 'linear'
  textureMode: TextureMode; // 'grain' | 'grid' | 'plain'
  themeId: string;
  
  // 스타일링 커스텀
  customBgType: 'preset' | 'color' | 'gradient' | 'image';
  customBgValue: string;
  
  // 사용자 업로드 이미지 설정
  userBgImage: string | null; // Data URL or Image URL
  bgImageSizeMode: ImageSizeMode; // 'cover' (확대 꽉채움) | 'contain' (비율 맞춤) | 'fill' (16:9 강제 핏)
  
  // 카드 공통 스타일
  cardBgColor: string; // hex (예: #FFFFFF 또는 #F5F2EB)
  cardBgOpacity: number; // 0 to 100
  cardBlur: number; // 0 to 30 (px)
  cardBorderColor: string;
  cardTextColor: string;
  cardTitleColor: string;
  selectedFont: string; // 폰트 패밀리 이름
  fontSizeScale: number; // 폰트 크기 비율 (예: 80% ~ 140%, 기본값 100)
  
  showWashiTape: boolean; // 마스킹 테이프 디테일 온/오프
  showCrayonUnderlines: boolean; // 크레용 밑줄/하이라이트 온/오프
}
