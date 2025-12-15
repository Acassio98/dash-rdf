import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface ContractInfo {
  contractNumber: string;
  contractName: string;
  totalBalance: number;
  difPrestacao: number;
  pendVrComplem: number;
  lastDailyDate: string;
  emitter: string;
}

interface ContractHeaderProps {
  info: ContractInfo;
}

export default function ContractHeader({ info }: ContractHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide">
              Contrato
            </p>
            <h1 className="text-3xl font-bold text-blue-900 mt-2">
              {info.contractNumber}
            </h1>
            <p className="text-lg text-blue-800 mt-1">{info.contractName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700 font-semibold">Emitente</p>
            <p className="text-2xl font-bold text-blue-900">{info.emitter}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">
                Saldo Dev Total
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                R$ {info.totalBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">
                Diferença de Prestação
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  info.difPrestacao < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                R$ {info.difPrestacao.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">
                Última Atualização
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {info.lastDailyDate}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
