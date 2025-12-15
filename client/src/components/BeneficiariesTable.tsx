import { ChevronDown, ChevronUp } from "lucide-react";
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

  return (
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
            {sortedData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border hover:bg-muted/20 transition-colors"
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
                <td className="px-6 py-4 text-sm text-right text-foreground font-mono">
                  R$ {item.vrPrevisto.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-foreground font-mono font-semibold text-primary">
                  R$ {item.vrPagoFiador.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
