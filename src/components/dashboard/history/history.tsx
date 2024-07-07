"use client";
import { IPeriod, PreferencesType, Timeframe } from "@/lib/types";
import { useMemo, useState } from "react";
import { getFormatterForCurrency } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryPeriodSelector from "@/components/dashboard/history/history-period-selector";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "@/components/ui/custom/custom-tooltip";

const History = ({ userPreferences }: PreferencesType) => {
  const [timeFrame, setTimeFrame] = useState<Timeframe>("year");
  const [period, setPeriod] = useState<IPeriod>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userPreferences.currency);
  }, [userPreferences.currency]);

  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeFrame}&year=${period.year}&month=${period.month}`,
      ).then((res) => res.json()),
  });

  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length;
  return (
    <div className={"container"}>
      <h2 className={"mt-2 text-3xl font-bold "}>History</h2>
      <Card className={"col-span-12 mt-2 w-full"}>
        <CardHeader className={"gap-2"}>
          <CardTitle
            className={
              "grid grid-flow-row justify-between gap-2 md:grid-flow-col"
            }
          >
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />

            <div className={"flex h-10 gap-2"}>
              <Badge
                variant={"outline"}
                className={"flex items-center gap-2 text-sm"}
              >
                <div className={"h-4 w-4 rounded-full bg-emerald-500"}></div>
                Income
              </Badge>
              <Badge
                variant={"outline"}
                className={"flex items-center gap-2 text-sm"}
              >
                <div className={"h-4 w-4 rounded-full bg-rose-500"}></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isLoading}>
            {dataAvailable && (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient
                      id={"incomeBar"}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <stop offset={0} stopColor={"#10b981"} stopOpacity={1} />
                      <stop offset={1} stopColor={"#10b981"} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id={"expenseBar"}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={1}
                    >
                      <stop offset={0} stopColor={"#ef4444"} stopOpacity={1} />
                      <stop offset={1} stopColor={"#ef4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray={"5 5"}
                    strokeOpacity={"0.2"}
                    vertical={false}
                  />
                  <XAxis
                    stroke={"#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === "year")
                        return date.toLocaleDateString("default", {
                          month: "long",
                        });
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke={"#888888"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    label={"Income"}
                    fill={"url(#incomeBar)"}
                    radius={4}
                    className={"cursor-pointer"}
                  />
                  <Bar
                    dataKey={"expense"}
                    label={"Expense"}
                    fill={"url(#expenseBar)"}
                    radius={4}
                    className={"cursor-pointer"}
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card
                className={
                  "flex h-[300px] flex-col items-center justify-center bg-background"
                }
              >
                No data for the selected period
                <p className={"text-sm text-muted-foreground"}>
                  Try selecting a different period or adding new transaction
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
