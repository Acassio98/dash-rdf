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
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { ExportButton } from "@/components/ExportButton";
import { CompetencySearch } from "@/components/CompetencySearch";
import { FinalSummary } from "@/components/FinalSummary";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Eye, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [filters, setFilters] = useState<FilterState>({
    beneficiaryName: '',
    minValue: null,
    maxValue: null,
    paymentStatus: 'all',
  });
  const [data, setData] = useState<ContractData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Por favor, selecione um arquivo PDF válido");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao processar PDF');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
        setSelectedBlock(0);
        toast.success("PDF carregado com sucesso!");
      } else {
        throw new Error(result.error || 'Erro ao processar PDF');
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao processar o PDF. Verifique se está no formato correto.");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-background relative">
      {/* Marca d'água */}
      <div className="fixed bottom-4 right-4 text-muted-foreground/20 text-sm font-medium pointer-events-none z-0">
        Acassio Silva
      </div>
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
      <main className="container py-8 space-y-8 relative z-10">
        {/* Contract Header */}
        <ContractHeader info={data.contractInfo} />

        {/* Upload PDF Section */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Carregar Novo PDF
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione um arquivo PDF do mesmo modelo para extrair e visualizar os dados automaticamente.
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button
                  asChild
                  disabled={uploading}
                  className="cursor-pointer"
                >
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar PDF
                      </>
                    )}
                  </label>
                </Button>
              </label>
            </div>
            <div className="hidden md:block text-purple-300 text-6xl">
              📄
            </div>
          </div>
        </Card>

        {/* Advanced Filters */}
        <AdvancedFilters
          onFiltersChange={setFilters}
          onReset={() => setFilters({
            beneficiaryName: '',
            minValue: null,
            maxValue: null,
            paymentStatus: 'all',
          })}
        />

        {/* Block Selection and View Mode */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-80 space-y-4">
            <div>
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
            <CompetencySearch
              availableDates={data.blocks.map((b: any) => b.referenceDate)}
              onSelect={setSelectedBlock}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
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
            <ExportButton
              data={data}
              blockId={selectedBlock}
              referenceDate={currentBlock.referenceDate}
            />
          </div>
        </div>

        {/* Block Summary */}
        <BlockSummary totals={currentBlock.totals} />

        {/* Content Area */}
        {viewMode === "table" ? (
          <BeneficiariesTable
            data={currentBlock.beneficiaries.filter(beneficiary => {
              // Aplicar filtros
              if (filters.beneficiaryName && !beneficiary.name.toLowerCase().includes(filters.beneficiaryName.toLowerCase())) {
                return false;
              }
              if (filters.minValue !== null && beneficiary.vrPrevisto < filters.minValue) {
                return false;
              }
              if (filters.maxValue !== null && beneficiary.vrPrevisto > filters.maxValue) {
                return false;
              }
              if (filters.paymentStatus === 'paid' && beneficiary.pgMutuario === '00/00/0000') {
                return false;
              }
              if (filters.paymentStatus === 'unpaid' && beneficiary.pgMutuario !== '00/00/0000') {
                return false;
              }
              return true;
            })}
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

        {/* Final Summary */}
        <FinalSummary data={data} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12 relative z-10">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Dash RDF © 2025 - Dashboard de Leitura de Dados de Contratos</p>
        </div>
      </footer>
    </div>
  );
}
