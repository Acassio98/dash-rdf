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

// Função simples para converter texto do PDF em dados estruturados
export async function extractPdfData(buffer: Buffer): Promise<ContractData> {
  try {
    // Converter buffer para string (PDF como texto)
    const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 10000));

    // Extrair informações do contrato
    const contractMatch = text.match(/CONTRATO\s+(\d+)\s+([A-Z\s]+)/);
    const contractNumber = contractMatch?.[1] || "DESCONHECIDO";
    const contractName = contractMatch?.[2]?.trim() || "DESCONHECIDO";

    const saldoMatch = text.match(/SALDO\s+DEV\s+TOTAL\s*:\s*([\d.,]+)/);
    const totalBalance = parseFloat(saldoMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0");

    const difMatch = text.match(/DIF\s+PRESTACAO\s*:\s*([-\d.,]+)/);
    const difPrestacao = parseFloat(difMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0");

    const lastDateMatch = text.match(/ULTIMA\s+DIARIA\s*:\s*(\d{2}\/\d{2}\/\d{4})/);
    const lastDailyDate = lastDateMatch?.[1] || "00/00/0000";

    const emitterMatch = text.match(/Emitente:\s*(\d+)/);
    const emitter = emitterMatch?.[1] || "DESCONHECIDO";

    // Para este exemplo, retornamos dados vazios já que a extração completa
    // requer uma biblioteca PDF mais robusta
    const blocks: ContractData['blocks'] = [];

    return {
      contractInfo: {
        contractNumber,
        contractName,
        totalBalance,
        difPrestacao,
        pendVrComplem: 0,
        lastDailyDate,
        emitter,
      },
      blocks,
    };
  } catch (error) {
    console.error("Erro ao extrair PDF:", error);
    throw new Error("Falha ao processar PDF");
  }
}
