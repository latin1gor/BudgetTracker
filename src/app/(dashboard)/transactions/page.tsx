"use client";

import { DateRangePicker } from "@/components/ui/custom/date-range-picker";
import { differenceInDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";
import { useState } from "react";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import TransactionsTable from "@/components/transactions/transactions-table";
import { FromToType } from "@/lib/types";

const TransactionPage = () => {
  const [dateRange, setDateRange] = useState<FromToType>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className={"bg-card border-b"}>
        <div
          className={
            "container flex flex-wrap items-center justify-between gap-6 py-8"
          }
        >
          <div className={"flex w-full justify-between"}>
            <p className={"text-3xl font-bold"}>Transactions history</p>
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
                  return;
                }

                setDateRange({ from, to });
              }}
            />
          </div>
        </div>
      </div>
      <div className={"container"}>
        <TransactionsTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
};

export default TransactionPage;
