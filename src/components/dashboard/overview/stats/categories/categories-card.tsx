import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { TransactionType } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface IProps {
  data: GetCategoriesStatsResponseType;
  formatter: Intl.NumberFormat;
  type: TransactionType;
}
const CategoriesCard = ({ data, type, formatter }: IProps) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce((acc, el) => {
    return acc + (el._sum?.amount || 0);
  }, 0);

  return (
    <Card className={"h-80 w-full col-span-6"}>
      <CardHeader>
        <CardTitle
          className={
            "grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col"
          }
        >
          {type === "income" ? "Incomes" : "Expenses"}
        </CardTitle>
      </CardHeader>
      <div className={"flex items-center justify-between gap-2"}>
        {filteredData.length === 0 && (
          <div
            className={"flex h-60 w-full flex-col items-center justify-center"}
          >
            No data for the selected period
            <p className={"text-sm text-muted-foreground"}>
              Try selecting a different period or try to add a different{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className={"h-60 w-full gap-4 p-4"}>
            <div className={"flex w-full flex-col gap-4 p-4"}>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className={"flex flex-col gap-2"}>
                    <div className={"flex items-center justify-between"}>
                      <span className={"flex items-center"}>
                        {item.categoryIcon} {item.category}
                        <span className={"ml-2 text-xs text-muted-foreground"}>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className={"text-sm text-gray-400"}>
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default CategoriesCard;
