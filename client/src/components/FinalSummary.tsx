import { Card } from '@/components/ui/card';
import { TrendingDown, DollarSign, CheckCircle } from 'lucide-react';

interface FinalSummaryProps {
  data: any;
}

export function FinalSummary({ data }: FinalSummaryProps) {
  if (!data || !data.blocks) {
    return null;
  }

  // Calcular totais consolidados
  let totalPrevisto = 0;
  let totalPago = 0;
  let totalIncorporado = 0;
  let totalAmortizado = 0;
  let totalEstornado = 0;

  for (const block of data.blocks) {
    totalPrevisto += block.totals.vrPrevisto;
    totalPago += block.totals.vrPagoFiador;
    totalIncorporado += block.totals.vrIncorporado;
    totalAmortizado += block.totals.vrAmortizado;
    totalEstornado += block.totals.vrEstornado;
  }

  // Calcular saldo
  const saldoDevedor = totalPrevisto - totalPago;
  const saldoLiquido = totalPrevisto - totalAmortizado;

  // Calcular percentuais
  const percentualPago = totalPrevisto > 0 ? ((totalPago / totalPrevisto) * 100).toFixed(2) : '0.00';
  const percentualAmortizado = totalPrevisto > 0 ? ((totalAmortizado / totalPrevisto) * 100).toFixed(2) : '0.00';

  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo Consolidado</h2>

      {/* Resumo de Cálculos Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Total Previsto</p>
              <p className="text-2xl font-bold text-blue-900">R$ {totalPrevisto.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Total Pago</p>
              <p className="text-2xl font-bold text-green-900">R$ {totalPago.toFixed(2)}</p>
              <p className="text-xs text-green-700 mt-1">{percentualPago}% do total</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Amortizado</p>
              <p className="text-2xl font-bold text-orange-900">R$ {totalAmortizado.toFixed(2)}</p>
              <p className="text-xs text-orange-700 mt-1">{percentualAmortizado}% do total</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo Devedor</p>
              <p className="text-2xl font-bold text-red-900">R$ {saldoDevedor.toFixed(2)}</p>
              <p className="text-xs text-red-700 mt-1">Não pago</p>
            </div>
            <DollarSign className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Cálculo Detalhado */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cálculo Consolidado</h3>
        
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300">
            <span className="text-gray-700">Valor Total Previsto</span>
            <span className="font-bold text-gray-900">R$ {totalPrevisto.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-red-600">
            <span>(-) Valor Amortizado</span>
            <span className="font-bold">R$ {totalAmortizado.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b-2 border-gray-400 text-lg font-bold">
            <span className="text-gray-800">(=) Saldo Líquido</span>
            <span className="text-blue-900">R$ {saldoLiquido.toFixed(2)}</span>
          </div>

          <div className="pt-4 space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Valor Incorporado</span>
              <span>R$ {totalIncorporado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor Estornado</span>
              <span>R$ {totalEstornado.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estatísticas Gerais */}
      <Card className="p-6 mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas Gerais</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total de Períodos</p>
            <p className="text-2xl font-bold text-indigo-900">{data.blocks.length}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Taxa de Pagamento</p>
            <p className="text-2xl font-bold text-green-900">{percentualPago}%</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Taxa de Amortização</p>
            <p className="text-2xl font-bold text-orange-900">{percentualAmortizado}%</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600 mb-1">Saldo Devedor (%)</p>
            <p className="text-2xl font-bold text-red-900">
              {((saldoDevedor / totalPrevisto) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </Card>

      <div className="text-right mt-6 text-gray-500 text-sm">
        Acassio Silva
      </div>
    </div>
  );
}
