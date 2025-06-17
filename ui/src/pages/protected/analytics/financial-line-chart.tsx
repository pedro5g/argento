import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import type { DailySummary } from "@/api/api-types";
import { Count } from "@/components/count";

interface FinancialLineChartProps {
  data: DailySummary[];
  isLoading?: boolean;
}

const chartConfig = {
  views: {
    label: "Financial Overview",
  },
  income: {
    label: "Income",
    color: "var(--color-green-500)",
  },
  expense: {
    label: "Expense",
    color: "var(--color-red-500)",
  },
  balance: {
    label: "Balance",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

export function FinancialLineChart({
  data,
  isLoading = false,
}: FinancialLineChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("income");

  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      income: parseFloat(item.total_income),
      expense: parseFloat(item.total_expense),
      balance: parseFloat(item.total_income) - parseFloat(item.total_expense),
    }));
  }, [data]);

  const totals = useMemo(
    () => ({
      income: chartData.reduce((acc, curr) => acc + curr.income, 0),
      expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
      balance: chartData.reduce((acc, curr) => acc + curr.balance, 0),
    }),
    [chartData]
  );

  if (isLoading) {
    return (
      <Card className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="h-[250px] bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Financial Overview - Multi-Line</CardTitle>
          <CardDescription>
            Complete view of income, expenses and balance
          </CardDescription>
        </div>
        <div className="flex">
          {(["income", "expense", "balance"] as const).map((key) => {
            const chart = key as keyof typeof chartConfig;
            const total = totals[key];
            const isPositive = total >= 0;
            const displayValue = key === "balance" ? Math.abs(total) : total;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-6 hover:bg-muted/30 transition-colors"
                onClick={() => setActiveChart(chart)}>
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  {chartConfig[chart].label}
                </span>
                <span
                  className={`text-lg leading-none font-bold sm:text-xl px-5 ${
                    key === "income"
                      ? "text-emerald-600"
                      : key === "expense"
                      ? "text-red-600"
                      : key === "balance"
                      ? "text-blue-600"
                      : isPositive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}>
                  <Count amount={displayValue.toString()} />
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--muted-foreground)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                return `$${Math.abs(value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    const numValue = Number(value);
                    const isNegative = numValue < 0;
                    const displayValue = Math.abs(numValue);

                    return [
                      `${isNegative ? "-" : ""}$${displayValue.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}`,
                      chartConfig[name as keyof typeof chartConfig]?.label ||
                        name,
                    ];
                  }}
                />
              }
            />

            <Line
              dataKey="income"
              type="monotone"
              stroke={chartConfig.income.color}
              strokeWidth={activeChart === "income" ? 3 : 2}
              strokeOpacity={activeChart === "income" ? 1 : 0.6}
              dot={{
                fill: chartConfig.income.color,
                strokeWidth: 2,
                r: activeChart === "income" ? 4 : 3,
                fillOpacity: activeChart === "income" ? 1 : 0.6,
              }}
              activeDot={{
                r: 6,
                stroke: chartConfig.income.color,
                strokeWidth: 2,
              }}
            />

            <Line
              dataKey="expense"
              type="monotone"
              stroke={chartConfig.expense.color}
              strokeWidth={activeChart === "expense" ? 3 : 2}
              strokeOpacity={activeChart === "expense" ? 1 : 0.6}
              dot={{
                fill: chartConfig.expense.color,
                strokeWidth: 2,
                r: activeChart === "expense" ? 4 : 3,
                fillOpacity: activeChart === "expense" ? 1 : 0.6,
              }}
              activeDot={{
                r: 6,
                stroke: chartConfig.expense.color,
                strokeWidth: 2,
              }}
            />

            <Line
              dataKey="balance"
              type="monotone"
              stroke={chartConfig.balance.color}
              strokeWidth={activeChart === "balance" ? 3 : 2}
              strokeOpacity={activeChart === "balance" ? 1 : 0.6}
              dot={{
                fill: chartConfig.balance.color,
                strokeWidth: 2,
                r: activeChart === "balance" ? 4 : 3,
                fillOpacity: activeChart === "balance" ? 1 : 0.6,
              }}
              activeDot={{
                r: 6,
                stroke: chartConfig.balance.color,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
