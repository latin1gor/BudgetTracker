"use client";
import { UserPreferences } from "@prisma/client";
import { useState } from "react";
import { differenceInDays, endOfMonth, startOfMonth } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";

interface IProps {
  userPreferences: UserPreferences;
}
interface DateRange {
  from: Date;
  to: Date;
}
const Overview = ({ userPreferences }: IProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div
        className={
          "container flex flex-wrap items-end justify-between py-6 gap-2"
        }
      >
        <h2 className={"text-3xl font-bold"}>Overview</h2>
        <div className={"flex items-center gap-3"}>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              // we update date range only if both dates are set

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`,
                );
              }
              return;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
