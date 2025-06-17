import type { CategoryTotal } from "@/api/api-types";
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
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface CategoryDistributionChartProps {
  data: CategoryTotal[];
  type: "Income" | "Expenses";
  isLoading: boolean;
}

export const CategoryDistributionChart = ({
  data,
  type,
  isLoading,
}: CategoryDistributionChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 bg-muted rounded mx-auto mb-2" />
          <Skeleton className="h-4 w-48 bg-muted rounded mx-auto" />
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
  ];

  const chartData = data.map((item, index) => ({
    ...item,
    value: parseFloat(item.total),
    fill: colors[index % colors.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig: ChartConfig = chartData.reduce((config, item, index) => {
    config[item.category] = {
      label: item.category,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Category Distribution - {type}
        </CardTitle>
        <CardDescription>
          Based on transactions from current period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  `$ ${value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}`,
                  `${((value / total) * 100).toFixed(1)}%`,
                ]}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, value }) =>
                  `${category}: ${((value / total) * 100).toFixed(1)}%`
                }
                labelLine={false}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
