import { IPeriod, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import YearSelector from "@/components/dashboard/history/year-selector";
import MonthSelector from "@/components/dashboard/history/month-selector";

interface IProps {
  period: IPeriod;
  setPeriod: (period: IPeriod) => void;
  timeFrame: Timeframe;
  setTimeFrame: (timeFrame: Timeframe) => void;
}
const HistoryPeriodSelector = ({
  period,
  setPeriod,
  setTimeFrame,
  timeFrame,
}: IProps) => {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
  });
  return (
    <div className={"flex flex-wrap items-center gap-4"}>
      <SkeletonWrapper isLoading={historyPeriods.isLoading} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value={"year"}>Year</TabsTrigger>
            <TabsTrigger value={"month"}>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className={"flex flex-wrap items-center gap-2"}>
        <SkeletonWrapper isLoading={historyPeriods.isLoading} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeFrame === "month" && (
          <SkeletonWrapper isLoading={historyPeriods.isLoading}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;
