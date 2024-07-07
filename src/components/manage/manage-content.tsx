import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CurrencyComboBox from "@/components/wizard/currency-combo-box";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import {
  Trash,
  TrendingDown,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import CreateCategoryDialog from "@/components/dashboard/header/category/create-category-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";

const ManageContent = () => {
  return (
    <div className={"container flex flex-col gap-4 p-4"}>
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <CategoryList type={"income"} />
      <CategoryList type={"expense"} />
    </div>
  );
};

export default ManageContent;

const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length;
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className={"flex items-center justify-between gap-2"}>
            <div className={"flex items-center gap-2"}>
              {type === "expense" ? (
                <TrendingDownIcon
                  className={
                    "h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500"
                  }
                />
              ) : (
                <TrendingUpIcon
                  className={
                    "h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500"
                  }
                />
              )}
              <div>
                {type === "income" ? "Incomes" : "Expenses"} categories
                <div className={"text-sm text-muted-foreground"}>
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch}
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div
            className={"flex h-40 w-full flex-col items-center justify-center"}
          >
            <p>
              {" "}
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500",
                )}
              >
                {type}
              </span>{" "}
              categories yet
            </p>
            <p className={"text-sm text-muted-foreground"}>
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div
            className={
              "grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }
          >
            {categoriesQuery.data.map((c: Category) => (
              <CategoryCard key={c.name} category={c} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div
      className={
        "flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]"
      }
    >
      <div className={"flex flex-col items-center gap-2 p-4"}>
        <span className={"text-3xl"} role={"img"}>
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <Button
        className={
          "flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
        }
        variant={"secondary"}
      >
        <Trash className={"h-4 w-4"} />
        Remove
      </Button>
    </div>
  );
};
