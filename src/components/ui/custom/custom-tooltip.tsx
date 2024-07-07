import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { useCallback } from "react";

interface ITooltipRow {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const { expense, income } = data;
  return (
    <div className={"min-w-[300px] rounded border bg-background p-4"}>
      <TooltipRow
        label={"Expense"}
        textColor={"text-red-500"}
        bgColor={"bg-red-500"}
        value={expense}
        formatter={formatter}
      />
      <TooltipRow
        label={"Income"}
        textColor={"text-emerald-500"}
        bgColor={"bg-emerald-500"}
        value={income}
        formatter={formatter}
      />
      <TooltipRow
        label={"Balance"}
        textColor={"text-foreground"}
        bgColor={"bg-gray-200"}
        value={income - expense}
        formatter={formatter}
      />
    </div>
  );
};

export default CustomTooltip;

const TooltipRow = ({
  label,
  bgColor,
  textColor,
  formatter,
  value,
}: ITooltipRow) => {
  const formattingFn = useCallback(
    (v: number) => formatter.format(v),
    [formatter],
  );
  return (
    <div className={"flex items-center gap-2"}>
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className={"flex w-full justify-between"}>
        <p className={"text-sm text-muted-foreground"}>{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className={"text-sm"}
          />
        </div>
      </div>
    </div>
  );
};
