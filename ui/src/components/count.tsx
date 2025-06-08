import { cn } from "@/lib/utils";
import CountUp from "react-countup";

interface CountProps {
  amount: string;
  className?: string;
}

export const Count = ({ amount, className }: CountProps) => {
  return (
    <CountUp
      preserveValue
      redraw={false}
      decimals={2}
      formattingFn={(amount) =>
        Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(amount)
      }
      end={parseFloat(amount)}
      className={cn(className)}
    />
  );
};
