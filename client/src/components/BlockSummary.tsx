import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface BlockTotals {
  vrPrevisto: number;
  vrPagoFiador: number;
  vrIncorporado: number;
  vrAmortizado: number;
  vrEstornado: number;
}

interface BlockSummaryProps {
  totals: BlockTotals;
}

export default function BlockSummary({ totals }: BlockSummaryProps) {
  const metrics = [
    {
      label: "Valor Previsto",
      value: totals.vrPrevisto,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Valor Pago Fiador",
      value: totals.vrPagoFiador,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Valor Incorporado",
      value: totals.vrIncorporado,
      icon: Zap,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Valor Amortizado",
      value: totals.vrAmortizado,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  R$ {metric.value.toFixed(2)}
                </p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
