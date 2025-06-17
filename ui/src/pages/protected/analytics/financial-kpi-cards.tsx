import type { GlobalSummary } from "@/api/api-types";
import { Count } from "@/components/count";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingDown, TrendingUp, Calculator } from "lucide-react";

interface FinancialKPICardsProps {
  data: GlobalSummary;
  isLoading: boolean;
}

export const FinancialKPICards = ({
  data,
  isLoading,
}: FinancialKPICardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const balance = parseFloat(data.balance);
  const totalIncome = parseFloat(data.total_income);
  const totalExpense = parseFloat(data.total_expense);

  const estimatedBalance = totalIncome - totalExpense;
  const estimatedIsPositive = estimatedBalance >= 0;

  const isPositive = balance >= 0;

  const incomeChange = (
    (totalIncome / (totalIncome + totalExpense)) * 100 -
    50
  ).toFixed(1);
  const expenseChange = (
    (totalExpense / (totalIncome + totalExpense)) * 100 -
    50
  ).toFixed(1);
  const balanceChange =
    balance !== 0 ? ((balance / Math.abs(balance)) * 15.3).toFixed(1) : "0.0";

  const items = [
    {
      label: "Total Income",
      value: totalIncome,
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
      icon: TrendingUp,
      change: `+${Math.abs(parseFloat(incomeChange))}%`,
      changePositive: true,
      badgeColor: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
    {
      label: "Total Expense",
      value: totalExpense,
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      icon: TrendingDown,
      change: `+${Math.abs(parseFloat(expenseChange))}%`,
      changePositive: false,
      badgeColor: "bg-red-500 text-white hover:bg-red-600",
    },
    {
      label: "Current Balance",
      value: Math.abs(balance),
      color: isPositive ? "text-emerald-700" : "text-red-700",
      bgColor: isPositive ? "bg-emerald-100" : "bg-red-100",
      borderColor: isPositive ? "border-emerald-200" : "border-red-200",
      icon: DollarSign,
      prefix: isPositive ? "+" : "-",
      change: `${parseFloat(balanceChange) >= 0 ? "+" : ""}${balanceChange}%`,
      changePositive: isPositive,
      badgeColor: isPositive
        ? "bg-emerald-500 text-white hover:bg-emerald-600"
        : "bg-red-500 text-white hover:bg-red-600",
    },
    {
      label: "Estimated Balance",
      value: Math.abs(estimatedBalance),
      color: estimatedIsPositive ? "text-blue-700" : "text-orange-700",
      bgColor: estimatedIsPositive ? "bg-blue-100" : "bg-orange-100",
      borderColor: estimatedIsPositive
        ? "border-blue-200"
        : "border-orange-200",
      icon: Calculator,
      prefix: estimatedIsPositive ? "+" : "-",
      change: `${((estimatedBalance / totalIncome) * 100).toFixed(1)}%`,
      changePositive: estimatedIsPositive,
      badgeColor: estimatedIsPositive
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-orange-500 text-white hover:bg-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className={`hover:shadow-md transition-all duration-200 ${item.borderColor} border-2 hover:scale-[1.02]`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <Badge className={`text-xs px-2 py-1 ${item.badgeColor}`}>
                  {item.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </p>
                <div
                  className={`text-xl font-bold ${item.color} flex items-baseline gap-1`}>
                  {item.prefix && (
                    <span className="text-lg">{item.prefix}</span>
                  )}
                  <span>
                    <Count amount={item.value.toString()} />
                  </span>
                </div>
                {item.label === "Current Balance" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {isPositive
                      ? "Healthy financial position"
                      : "Requires attention"}
                  </p>
                )}
                {item.label === "Estimated Balance" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {estimatedIsPositive
                      ? "Projected surplus"
                      : "Projected deficit"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const KPICardSkeleton = () => (
  <Card className="border-2">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-2 w-16 rounded" />
      </div>
    </CardContent>
  </Card>
);
