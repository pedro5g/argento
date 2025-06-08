import { Count } from "@/components/count";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  countUp?: boolean;
}

export const StatsCard = ({
  value,
  title,
  icon,
  countUp = true,
}: StatsCardProps) => {
  return (
    <Card className="p-0 rounded-md">
      <CardContent className="flex h-24 w-full items-center gap-2 ">
        {icon}
        <div className="flex flex-col items-start">
          <p className="text-muted-foreground capitalize">{title}</p>
          {countUp ? (
            <Count amount={value} className="text-2xl font-semibold" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
