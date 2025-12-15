import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContractHeader from "@/components/ContractHeader";
import BlockSummary from "@/components/BlockSummary";
import BeneficiariesTable from "@/components/BeneficiariesTable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Eye, EyeOff } from "lucide-react";

interface ContractData {
  contractInfo: {
    contractNumber: string;
    contractName: string;
    totalBalance: number;
    difPrestacao: number;
    pendVrComplem: number;
    lastDailyDate: string;
    emitter: string;
  };
  blocks: Array<{
    blockId: number;
    referenceDate: string;
    beneficiaries: Array<{
      contractUnd: string;
      name: string;
      rtNcpd: string;
      pgFiador: string;
      pgMutuario: string;
      vrPrevisto: number;
      vrPagoFiador: number;
    }>;
    totals: {
      vrPrevisto: number;
      vrPagoFiador: number;
      vrIncorporado: number;
      vrAmortizado: number;
      vrEstornado: number;
    };
  }>;
}

export default function Home() {
  const [data, setData] = useState<ContractData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <p className="text-foreground text-center">
            Erro ao carregar os dados. Por favor, tente novamente.
          </p>
        </Card>
      </div>
    );
  }

  const currentBlock = data.blocks[selectedBlock];
  const chartData = data.blocks.map((block) => ({
    date: block.referenceDate,
    previsto: block.totals.vrPrevisto,
    pago: block.totals.vrPagoFiador,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dash RDF</h1>
              <p className="text-sm text-muted-foreground">
                Dashboard de Leitura de Dados de Contratos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Contract Header */}
        <ContractHeader info={data.contractInfo} />

        {/* Block Selection and View Mode */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-foreground mb-2">
              Selecionar Período
            </label>
            <Select
              value={selectedBlock.toString()}
              onValueChange={(value) => setSelectedBlock(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um período" />
              </SelectTrigger>
              <SelectContent>
                {data.blocks.map((block, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {block.referenceDate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Tabela
            </Button>
            <Button
              variant={viewMode === "chart" ? "default" : "outline"}
              onClick={() => setViewMode("chart")}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Gráfico
            </Button>
          </div>
        </div>

        {/* Block Summary */}
        <BlockSummary totals={currentBlock.totals} />

        {/* Content Area */}
        {viewMode === "table" ? (
          <BeneficiariesTable
            data={currentBlock.beneficiaries}
            blockDate={currentBlock.referenceDate}
          />
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Evolução de Valores por Período
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `R$ ${(value as number).toFixed(2)}`}
                  />
                  <Legend />
                  <Bar dataKey="previsto" fill="#1e40af" name="Valor Previsto" />
                  <Bar dataKey="pago" fill="#10b981" name="Valor Pago" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Tendência de Pagamentos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `R$ ${(value as number).toFixed(2)}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="previsto"
                    stroke="#1e40af"
                    name="Valor Previsto"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="pago"
                    stroke="#10b981"
                    name="Valor Pago"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Summary Statistics */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resumo Geral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total de Períodos
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {data.blocks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total de Beneficiários Únicos
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {new Set(
                  data.blocks.flatMap((b) =>
                    b.beneficiaries.map((ben) => ben.contractUnd)
                  )
                ).size}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Valor Total Pago
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                R${" "}
                {data.blocks
                  .reduce((sum, block) => sum + block.totals.vrPagoFiador, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Dash RDF © 2025 - Dashboard de Leitura de Dados de Contratos</p>
        </div>
      </footer>
    </div>
  );
}
