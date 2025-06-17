import type { CategoryTotal } from "@/api/api-types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryDetailsProps {
  data: CategoryTotal[];
  type: "income" | "expense";
}

export const CategoryDetails = ({ data, type }: CategoryDetailsProps) => {
  const isIncome = type === "income";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isIncome ? "Income" : "Expense"} Details</CardTitle>
        <CardDescription>Detailed breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full">
                  {item.category_emoji}
                </div>
                <div>
                  <span className="font-medium text-sm">{item.category}</span>
                </div>
              </div>
              <Badge
                className={cn(
                  "font-mono font-semibold px-4 border-2",
                  isIncome
                    ? "bg-green-400 text-green-900 border-green-900"
                    : "bg-red-400 text-red-900 border-red-900"
                )}>
                R${" "}
                {parseFloat(item.total).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
