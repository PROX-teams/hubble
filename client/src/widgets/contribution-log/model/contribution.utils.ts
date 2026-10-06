import type { Note } from "@/entities/note/note.types";

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface MonthLabel {
  monthName: string;
  weekIndex: number;
}

export interface ContributionData {
  weeks: ContributionWeek[];
  monthLabels: MonthLabel[];
  totalContributions: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * 작성 노트 목록으로부터 최근 N주간의 실제 잔디(기여도) 데이터를 계산합니다.
 * @param notes 크리에이터가 작성한 노트 목록
 * @param numWeeks 표시할 주(Week) 수 (기본: 20주)
 */
export const calculateContributionData = (
  notes: Note[] = [],
  numWeeks = 20
): ContributionData => {
  // 1. 노트들의 날짜별 카운트 매핑 (YYYY-MM-DD 기준)
  const countByDate = new Map<string, number>();

  notes.forEach((note) => {
    const rawDate = note.date || (note as { createdAt?: string }).createdAt;
    if (!rawDate) return;

    // ISO string 또는 YYYY-MM-DD 형식 파싱
    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) return;

    const dateKey = parsedDate.toISOString().slice(0, 10);
    countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + 1);
  });

  // 2. 오늘 날짜 기준으로 종료일 및 시작일 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 이번 주의 마지막 요일(토요일)까지 채우기 위해 조정
  const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - dayOfWeek));

  const totalDays = numWeeks * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);

  const weeks: ContributionWeek[] = [];
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;
  let totalCount = 0;

  const currentCursor = new Date(startDate);

  for (let w = 0; w < numWeeks; w++) {
    const weekDays: ContributionDay[] = [];

    for (let d = 0; d < 7; d++) {
      const dateKey = currentCursor.toISOString().slice(0, 10);
      const isFuture = currentCursor > today;
      const count = isFuture ? 0 : countByDate.get(dateKey) || 0;

      if (!isFuture && count > 0) {
        totalCount += count;
      }

      // 기여도 레벨 산출 (0: 없음, 1: 1개, 2: 2개, 3: 3개, 4: 4개 이상)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else if (count >= 4) level = 4;

      weekDays.push({
        date: dateKey,
        count,
        level,
      });

      // 새로운 월이 시작되는 주차 감지 (주의 첫날 기준)
      if (d === 0) {
        const month = currentCursor.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            monthName: MONTH_NAMES[month],
            weekIndex: w,
          });
          lastMonth = month;
        }
      }

      currentCursor.setDate(currentCursor.getDate() + 1);
    }

    weeks.push({ days: weekDays });
  }

  return {
    weeks,
    monthLabels,
    totalContributions: totalCount,
  };
};
