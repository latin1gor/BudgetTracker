import { IStats } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { DateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { useMemo } from "react";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import CategoriesCard from "@/components/dashboard/overview/stats/categories/categories-card";

const CategoriesStats = ({ userPreferences, to, from }: IStats) => {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userPreferences.currency);
  }, [userPreferences.currency]);

  return (
    <div className={"flex w-full flex-wrap gap-2 md:flex-nowrap"}>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <CategoriesCard
          data={statsQuery.data || []}
          formatter={formatter}
          type={"income"}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <CategoriesCard
          data={statsQuery.data || []}
          formatter={formatter}
          type={"expense"}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;
