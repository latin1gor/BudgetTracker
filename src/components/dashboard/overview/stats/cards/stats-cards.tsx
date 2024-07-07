import { useQuery } from "@tanstack/react-query";
import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { useMemo } from "react";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import StatCard from "@/components/dashboard/overview/stats/cards/stat-card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { IStats } from "@/lib/types";

const StatsCards = ({ from, to, userPreferences }: IStats) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userPreferences.currency);
  }, [userPreferences.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className={"flex w-full flex-wrap gap-2 md:flex-nowrap"}>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={income}
          title={"Income"}
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={expense}
          title={"Expense"}
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={balance}
          title={"Balance"}
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCards;
