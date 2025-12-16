import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Beneficiary {
  contractUnd: string;
  name: string;
  rtNcpd: string;
  pgFiador: string;
  pgMutuario: string;
  vrPrevisto: number;
  vrPagoFiador: number;
}

interface BeneficiariesTableProps {
  data: Beneficiary[];
  blockDate: string;
}

// Função para verificar se o mutuário pagou
const getMutuarioPagamentoStatus = (pgMutuario: string) => {
  const isPaid = pgMutuario !== "00/00/0000";
  return {
    paid: isPaid,
    date: isPaid ? pgMutuario : null,
  };
};

export default function BeneficiariesTable({
  data,
  blockDate,
}: BeneficiariesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Beneficiary;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    return sortConfig.direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const handleSort = (key: keyof Beneficiary) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const SortIcon = ({ column }: { column: keyof Beneficiary }) => {
    if (sortConfig?.key !== column) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Calcular estatísticas
  const totalBeneficiaries = data.length;
  const paidCount = data.filter((b) => getMutuarioPagamentoStatus(b.pgMutuario).paid).length;
  const unpaidCount = totalBeneficiaries - paidCount;

  return (
    <div className="space-y-4">
      {/* Resumo de Pagamentos do Mutuário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Mutuários que Pagaram</p>
              <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Mutuários que NÃO Pagaram</p>
              <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Taxa de Pagamento</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalBeneficiaries > 0 ? ((paidCount / totalBeneficiaries) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela de Beneficiários */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Beneficiários - {blockDate}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("contractUnd")}
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Contrato UND
                    <SortIcon column="contractUnd" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Nome do Mutuário
                    <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("rtNcpd")}
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    RT NCPD
                    <SortIcon column="rtNcpd" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("pgFiador")}
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    PG Fiador
                    <SortIcon column="pgFiador" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">
                  Status Mutuário
                </th>
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort("vrPrevisto")}
                    className="flex items-center justify-end gap-2 font-semibold text-foreground hover:text-primary transition-colors w-full"
                  >
                    VR Previsto
                    <SortIcon column="vrPrevisto" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort("vrPagoFiador")}
                    className="flex items-center justify-end gap-2 font-semibold text-foreground hover:text-primary transition-colors w-full"
                  >
                    VR Pago Fiador
                    <SortIcon column="vrPagoFiador" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const mutuarioStatus = getMutuarioPagamentoStatus(item.pgMutuario);
                return (
                  <tr
                    key={index}
                    className={`border-b border-border transition-colors ${
                      mutuarioStatus.paid
                        ? "hover:bg-green-50/50"
                        : "hover:bg-red-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {item.contractUnd}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {item.rtNcpd}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {item.pgFiador}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {mutuarioStatus.paid ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-green-600">Pagou</p>
                            <p className="text-xs text-muted-foreground">
                              {mutuarioStatus.date}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-red-600">Não Pagou</p>
                            <p className="text-xs text-muted-foreground">
                              Pendente
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-foreground font-mono">
                      R$ {item.vrPrevisto.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-foreground font-mono font-semibold text-primary">
                      R$ {item.vrPagoFiador.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
