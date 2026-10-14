export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDateToYYYYMMDD(new Date());
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateToYYYYMMDD(d);
}

export function isConsecutiveDay(prevDateStr: string | null, currentDateStr: string): boolean {
  if (!prevDateStr) return false;
  
  const [y1, m1, d1] = prevDateStr.split('-').map(Number);
  const [y2, m2, d2] = currentDateStr.split('-').map(Number);
  
  const prevDate = new Date(y1, m1 - 1, d1);
  const currDate = new Date(y2, m2 - 1, d2);
  
  const diffMs = currDate.getTime() - prevDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
}

export function isSameDay(date1Str: string | null, date2Str: string): boolean {
  if (!date1Str) return false;
  return date1Str === date2Str;
}

export interface DayStatus {
  dateStr: string;
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  isCompleted: boolean;
}

export function getPast7DaysStatus(completedDates: string[], todayDateStr = getTodayDateString()): DayStatus[] {
  const [year, month, day] = todayDateStr.split('-').map(Number);
  const today = new Date(year, month - 1, day);
  
  const days: DayStatus[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateToYYYYMMDD(d);
    
    days.push({
      dateStr,
      dayLabel: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      isToday: dateStr === todayDateStr,
      isCompleted: completedDates.includes(dateStr),
    });
  }
  
  return days;
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  
  return { hours, minutes, seconds, formatted };
}
