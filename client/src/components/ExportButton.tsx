import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any;
  blockId: number;
  referenceDate: string;
}

export function ExportButton({ data, blockId, referenceDate }: ExportButtonProps) {
  const exportToCSV = () => {
    try {
      const block = data.blocks[blockId];
      if (!block) {
        toast.error('Bloco de dados não encontrado');
        return;
      }

      // Cabeçalhos
      const headers = [
        'Contrato UND',
        'Nome do Beneficiário',
        'RT NCPD',
        'PG Fiador',
        'PG Mutuário',
        'Valor Previsto',
        'Valor Pago Fiador',
        'Status Pagamento',
      ];

      // Dados
      const rows = block.beneficiaries.map((b: any) => [
        b.contractUnd,
        b.name,
        b.rtNcpd,
        b.pgFiador,
        b.pgMutuario,
        b.vrPrevisto.toFixed(2),
        b.vrPagoFiador.toFixed(2),
        b.pgMutuario === '00/00/0000' ? 'Não Pago' : 'Pago',
      ]);

      // Totais
      rows.push([
        'TOTAIS',
        '',
        '',
        '',
        '',
        block.totals.vrPrevisto.toFixed(2),
        block.totals.vrPagoFiador.toFixed(2),
        '',
      ]);

      // Criar CSV
      const csv = [
        `Contrato: ${data.contractInfo.contractNumber}`,
        `Nome: ${data.contractInfo.contractName}`,
        `Período: ${referenceDate}`,
        `Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`,
        '',
        headers.join(','),
        ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio_${referenceDate.replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Dados exportados em CSV com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar dados em CSV');
    }
  };

  const exportToImage = async () => {
    try {
      // Dinâmicamente importar html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById(`chart-${blockId}`);
      if (!element) {
        toast.error('Gráfico não encontrado');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `grafico_${referenceDate.replace(/\//g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Gráfico exportado como PNG com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar imagem:', error);
      toast.error('Erro ao exportar gráfico como imagem');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCSV}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        <FileText className="w-4 h-4" />
        CSV
      </Button>
      <Button
        onClick={exportToImage}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        <Image className="w-4 h-4" />
        PNG
      </Button>
    </div>
  );
}
