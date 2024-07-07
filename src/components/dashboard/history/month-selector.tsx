import { IYearSelector, MonthSelectorType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MonthSelector = ({ period, setPeriod }: MonthSelectorType) => {
  const months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <Select
      value={period.month.toString()}
      onValueChange={(v) =>
        setPeriod({ month: parseInt(v), year: period.year })
      }
    >
      <SelectTrigger className={"w-[180px]"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map((m) => {
          const monthStr = new Date(period.year, m, 1).toLocaleString(
            "default",
            { month: "long" },
          );
          return (
            <SelectItem key={m} value={m.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
