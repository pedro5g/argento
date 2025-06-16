import {
  periods,
  useFinancialHistory,
  type FinancialPeriod,
} from "@/api/hooks/use-financial-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  income: {
    label: "Income",
    color: "#10B981",
  },
  expense: {
    label: "Expense",
    color: "#EF4444",
  },
  balance: {
    label: "Balance",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export const FinancialHistoryChart = () => {
  const [period, setPeriod] = useState<FinancialPeriod>("current_month");
  const { data, isLoading, isError } = useFinancialHistory(period);

  const chartData =
    data?.data.data.map((entry) => ({
      date: `${entry.month.toString().padStart(2, "0")}/${entry.day
        .toString()
        .padStart(2, "0")}`,
      income: entry.income,
      expense: Math.abs(entry.expense),
      balance: entry.balance,
    })) || [];

  const summary = data?.data.summary;
  const isPositiveBalance = summary ? summary.net_balance > 0 : true;

  const formatPeriodName = (period: string) => {
    return period.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Financial History</CardTitle>
            <CardDescription>
              {summary && `${summary.period.start} - ${summary.period.end}`}
            </CardDescription>
          </div>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as FinancialPeriod)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {formatPeriodName(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="w-full p-6">
        {isLoading ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <div className="text-red-500">Error loading data.</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              No data available for the selected period.
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={chartData} barCategoryGap={10}>
              <CartesianGrid
                strokeDasharray="5 5"
                strokeOpacity="0.5"
                vertical={false}
                stroke="var(--color-zinc-400)"
              />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                padding={{ left: 5, right: 5 }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0, 0, 0, 0)" }}
                content={<ChartTooltipContent />}
              />
              <Bar
                label="Income"
                dataKey="income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Income"
                className="cursor-pointer"
              />
              <Bar
                label="Expense"
                dataKey="expense"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Expense"
                className="cursor-pointer"
              />

              <Bar
                label="Balance"
                dataKey="balance"
                fill="#3B42F6"
                radius={[4, 4, 0, 0]}
                name="Balance"
                className="cursor-pointer"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {summary && (
          <>
            <div className="flex gap-2 leading-none font-medium">
              {isPositiveBalance ? (
                <>
                  Positive balance of {formatCurrency(summary.net_balance)}
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </>
              ) : (
                <>
                  Deficit of {formatCurrency(Math.abs(summary.net_balance))}
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </>
              )}
            </div>
            <div className="text-muted-foreground leading-none">
              Income: <strong>{formatCurrency(summary.total_income)}</strong> |
              Expenses: <strong>{formatCurrency(summary.total_expense)}</strong>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
