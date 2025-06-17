import type { MonthlySummary } from "@/api/api-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartSkeleton } from "./chart-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlySummaryChartProps {
  data: MonthlySummary[];
  isLoading: boolean;
}

export const MonthlySummaryChart = ({
  data,
  isLoading,
}: MonthlySummaryChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-muted rounded mb-2" />
          <Skeleton className="h-6 w-48 bg-muted rounded " />
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    income: parseFloat(item.total_income),
    expenses: parseFloat(item.total_expense),
    balance: parseFloat(item.total_income) - parseFloat(item.total_expense),
    monthName: new Date(item.year, item.month - 1).toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    }),
  }));

  const chartConfig: ChartConfig = {
    income: {
      label: "Income",
      color: "var(--color-green-500)",
    },
    expenses: {
      label: "Expenses",
      color: "var(--color-red-500)",
    },
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Summary
          </CardTitle>
          <CardDescription>
            Evolution of income and expenses over the months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="monthName"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR")}`
                }
                fontSize={12}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  `R$ ${value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`,
                  "",
                ]}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="var(--color-green-500)"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-red-500)"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
