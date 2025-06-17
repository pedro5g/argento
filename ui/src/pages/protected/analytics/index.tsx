import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiGraphTransaction } from "@/api/endpoints";
import type { GraphTransactionResponseType } from "@/api/api-types";
import { generatePDF } from "./analytics-pdf";
import { FinancialKPICards, KPICardSkeleton } from "./financial-kpi-cards";
import { ChartSkeleton } from "./chart-skeleton";
import { MonthlySummaryChart } from "./monthly-summary-chart";
import { CategoryDistributionChart } from "./category-distribution-chart";
import { CategoryDetails } from "./category-details";
import { FinancialLineChart } from "./financial-line-chart";
import { Count } from "@/components/count";

export function Analytics() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isExporting, setIsExporting] = useState(false);

  const { data, isPending, refetch } = useQuery<GraphTransactionResponseType>({
    queryFn: () => ApiGraphTransaction(),
    queryKey: ["transaction-graph"],
  });

  const handleRefresh = (): void => {
    refetch();
  };

  const handleExportPDF = async (): Promise<void> => {
    if (!data?.graphData) return;

    setIsExporting(true);
    try {
      await generatePDF(data.graphData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!data?.graphData && isPending) {
    return (
      <div className="w-full min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <KPICardSkeleton key={i} />
              ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <ChartSkeleton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.graphData) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Error loading data</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
              Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete analysis of your finances with detailed insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isPending}
              variant="outline"
              size="sm">
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
              />
              Update
            </Button>
            <div>
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                variant="blue"
                size="sm">
                {isExporting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        <FinancialKPICards
          data={data.graphData.globalSummary}
          isLoading={isPending}
        />

        <FinancialLineChart
          data={data.graphData.dailySummary}
          isLoading={isPending}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6">
          <TabsList className="gap-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>

            <TabsTrigger value="income" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Incomes</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MonthlySummaryChart
                data={data.graphData.monthlySummary}
                isLoading={isPending}
              />
              <CategoryDistributionChart
                data={data.graphData.categoryDistribution.income}
                type="Income"
                isLoading={isPending}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CategoryDistributionChart
                data={data.graphData.categoryDistribution.expense}
                type="Expenses"
                isLoading={isPending}
              />
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Days
                    </span>
                    <span className="font-medium">
                      {data.graphData.dailySummary.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Average Daily Income
                    </span>
                    <span className="font-medium text-emerald-600">
                      <Count
                        amount={(
                          data.graphData.dailySummary.reduce(
                            (acc, day) => acc + parseFloat(day.total_income),
                            0
                          ) / data.graphData.dailySummary.length
                        ).toString()}
                      />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Average Daily Expense
                    </span>
                    <span className="font-medium text-red-600">
                      <Count
                        amount={(
                          data.graphData.dailySummary.reduce(
                            (acc, day) => acc + parseFloat(day.total_expense),
                            0
                          ) / data.graphData.dailySummary.length
                        ).toString()}
                      />
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CategoryDistributionChart
                data={data.graphData.categoryDistribution.income}
                type="Income"
                isLoading={isPending}
              />
              <CategoryDetails
                data={data.graphData.categoryDistribution.income}
                type="income"
              />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CategoryDistributionChart
                data={data.graphData.categoryDistribution.expense}
                type="Expenses"
                isLoading={isPending}
              />
              <CategoryDetails
                data={data.graphData.categoryDistribution.expense}
                type="expense"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
