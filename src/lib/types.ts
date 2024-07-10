import { UserPreferences } from "@prisma/client";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";

export type TransactionType = "income" | "expense";
export interface IStats {
  from: Date;
  to: Date;
  userPreferences: UserPreferences;
}
export type PreferencesType = Omit<IStats, "from" | "to">;
export type FromToType = Omit<IStats, "userPreferences">;
export type Timeframe = "month" | "year";
export interface IPeriod {
  year: number;
  month: number;
}
export interface IYearSelector {
  period: IPeriod;
  setPeriod: (period: IPeriod) => void;
  years: GetHistoryPeriodsResponseType;
}
export type MonthSelectorType = Omit<IYearSelector, "years">;
