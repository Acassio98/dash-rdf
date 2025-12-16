import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
// Importar dados do contexto global se necessário
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BeneficiaryDetail() {
  const [, params] = useRoute('/beneficiary/:id');
  // Dados virão via props ou contexto global
  const data = (window as any).__dashData;

  if (!data || !params) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Beneficiário não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  // Encontrar o beneficiário em todos os blocos
  const beneficiaryId = params.id;
  const beneficiaryHistory: any[] = [];
  let beneficiaryName = '';

  for (const block of data.blocks) {
    for (const beneficiary of block.beneficiaries) {
      if (beneficiary.contractUnd === beneficiaryId) {
        beneficiaryName = beneficiary.name;
        beneficiaryHistory.push({
          date: block.referenceDate,
          value: beneficiary.vrPrevisto,
          paid: beneficiary.vrPagoFiador,
          status: beneficiary.pgMutuario === '00/00/0000' ? 'Não Pago' : 'Pago',
          paymentDate: beneficiary.pgMutuario,
        });
      }
    }
  }

  if (beneficiaryHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Button onClick={() => window.history.back()} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center">
            <p className="text-gray-600">Beneficiário não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = beneficiaryHistory.reduce((sum, item) => sum + item.value, 0);
  const totalPaid = beneficiaryHistory.reduce((sum, item) => sum + item.paid, 0);
  const paymentRate = totalValue > 0 ? ((totalPaid / totalValue) * 100).toFixed(1) : '0';

  const chartData = beneficiaryHistory.map(item => ({
    date: item.date,
    'Previsto': item.value,
    'Pago': item.paid,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Button onClick={() => window.history.back()} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{beneficiaryName}</h1>
          <p className="text-gray-600 mb-6">Contrato: {beneficiaryId}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-green-500">
              <p className="text-sm text-gray-600 mb-1">Valor Total Previsto</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <p className="text-sm text-gray-600 mb-1">Valor Total Pago</p>
              <p className="text-2xl font-bold text-blue-600">R$ {totalPaid.toFixed(2)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <p className="text-sm text-gray-600 mb-1">Taxa de Pagamento</p>
              <p className="text-2xl font-bold text-orange-600">{paymentRate}%</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-purple-500">
              <p className="text-sm text-gray-600 mb-1">Registros</p>
              <p className="text-2xl font-bold text-purple-600">{beneficiaryHistory.length}</p>
            </Card>
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução de Pagamentos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Previsto" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Pago" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Tabela de Histórico */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Pagamentos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Data</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor Previsto</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor Pago</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Data Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaryHistory.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{item.date}</td>
                    <td className="px-4 py-3 text-right text-gray-800">R$ {item.value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">R$ {item.paid.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Pago' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-800">
                      {item.paymentDate === '00/00/0000' ? '-' : item.paymentDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="text-right mt-6 text-gray-500 text-sm">
          Acassio Silva
        </div>
      </div>
    </div>
  );
}
