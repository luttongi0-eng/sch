import { DaySchedule } from '@/types/schedule';

/**
 * 주어진 기준 날짜(기본값: 오늘)를 기준으로 해당 주의 월요일부터 일요일까지의 날짜 정보를 계산합니다.
 */
export function getWeekDates(baseDate: Date = new Date()) {
  const current = new Date(baseDate);
  // getDay(): 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
  const dayOfWeek = current.getDay();
  // 월요일을 주의 시작(0)으로 계산 (일요일은 6이 됨)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(current);
  monday.setDate(current.getDate() + mondayOffset);

  const dates: { id: string; dateStr: string; fullDate: Date }[] = [];
  const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push({
      id: dayIds[i],
      dateStr: `${mm}.${dd}`,
      fullDate: d,
    });
  }

  const startMonth = String(dates[0].fullDate.getMonth() + 1).padStart(2, '0');
  const startDay = String(dates[0].fullDate.getDate()).padStart(2, '0');
  const endMonth = String(dates[6].fullDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(dates[6].fullDate.getDate()).padStart(2, '0');
  const year = dates[0].fullDate.getFullYear();

  // 해당 월의 몇 주차인지 계산
  // 월요일 기준 해당 월의 일자 / 7 올림
  const weekNum = Math.ceil(dates[0].fullDate.getDate() / 7);
  const weekNumberStr = `${Number(startMonth)}월 ${weekNum}주차`;
  const headerSubtitleStr = `${year} | ${startMonth}.${startDay} ~ ${endMonth}.${endDay}`;

  return {
    year,
    weekNumber: weekNumberStr,
    headerSubtitle: headerSubtitleStr,
    dayDates: dates,
  };
}

/**
 * 초기 또는 기존 days 배열에 현재 주차의 날짜를 반영하는 헬퍼 함수
 */
export function applyCurrentWeekDates(days: DaySchedule[], baseDate: Date = new Date()): DaySchedule[] {
  const { dayDates } = getWeekDates(baseDate);
  const dateMap = new Map(dayDates.map((d) => [d.id, d.dateStr]));

  return days.map((day) => ({
    ...day,
    dateStr: dateMap.get(day.id) || day.dateStr,
  }));
}
