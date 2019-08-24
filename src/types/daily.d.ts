export interface DailyItem {
  dailyId?: string;
  today?: string | null;
  tomorrow?: string | null;
  goal?: string | null;
  userName?: string;
  create?: number;
  update?: number;

  [propName: string]: any;
}
