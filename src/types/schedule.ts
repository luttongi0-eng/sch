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
  
  // DIY 커스텀 자유 배치 모드 전용 좌표 및 크기 (px 단위, 1920x1080 기준)
  diyX?: number; // X 좌표 (0 ~ 1920)
  diyY?: number; // Y 좌표 (0 ~ 1080)
  diyWidth?: number; // 박스 너비 (기본값 약 380px)
  diyHeight?: number; // 박스 높이
}

export type LayoutMode = 'bento' | 'linear' | 'notebook' | 'polaroid' | 'custom_diy';
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
  
  // 일러스트 / 캐릭터 스케줄러 전용 설정
  artByText?: string; // "그려주신분 이름"
  notebookAlign?: 'left' | 'right'; // 스케줄 표 위치 (우측 또는 좌측)
  polaroidPhoto?: string | null; // 폴라로이드 프레임 내에 넣을 사진/일러스트 (선택)
  
  // DIY 커스텀 모드 설정
  diyShowCardBg?: boolean; // DIY 요일 박스에 반투명 배경 카드를 씌울지, 텍스트만 깔끔하게 올릴지 여부
  diyGlobalWidth?: number; // DIY 요일 박스 공통 너비
  diyShowDayBadge?: boolean; // 요일 원형 뱃지 및 영문 요일명 표시 여부 (틀에 이미 요일이 적혀있는 경우 숨김)
  diyShowHeader?: boolean; // 상단 헤더(Weekly Schedule 타이틀, 기간/주차, 공지, 채널 태그) 표시 여부
  
  // DIY Artist 크레딧 드래그 박스 설정
  diyShowArtist?: boolean; // Artist 박스 표시 여부
  diyArtistX?: number; // Artist 박스 X 좌표
  diyArtistY?: number; // Artist 박스 Y 좌표
  diyArtistPrefix?: string; // "ARTIST." 또는 "Art By." 등 접두사
  
  // DIY 커스텀 삽입 이미지 (일러스트/캐릭터 사진 등) 드래그 박스 설정
  diyCustomImage?: string | null; // 이미지 Base64/URL
  diyImageX?: number; // 이미지 X 좌표
  diyImageY?: number; // 이미지 Y 좌표
  diyImageWidth?: number; // 이미지 너비
  diyImageHeight?: number; // 이미지 높이
}

export interface PlacedSticker {
  id: string;
  type: 'emoji' | 'image';
  content: string; // 이모지 문자(예: "⭐") 또는 Base64/PNG URL
  x: number; // 0 ~ 1920
  y: number; // 0 ~ 1080
  size: number; // px 크기 (기본값 약 60 ~ 120)
  rotation: number; // 각도 (-180 ~ 180 deg)
}
