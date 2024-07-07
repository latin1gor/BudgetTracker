import { IYearSelector } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const YearSelector = ({ period, setPeriod, years }: IYearSelector) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(v) =>
        setPeriod({ month: period.month, year: parseInt(v) })
      }
    >
      <SelectTrigger className={"w-[180px]"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={y.toString()}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelector;
