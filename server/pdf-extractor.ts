import PDFParser from 'pdf2json';

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

// Função para extrair texto do PDF
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(`Erro ao processar PDF: ${errData.parserError}`));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let fullText = '';
        
        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const text of page.Texts) {
                if (text.R && text.R[0] && text.R[0].T) {
                  // Decodificar o texto (pode estar em URL encoding)
                  const decodedText = decodeURIComponent(text.R[0].T);
                  fullText += decodedText + ' ';
                }
              }
            }
            fullText += '\n';
          }
        }
        
        resolve(fullText);
      } catch (error) {
        reject(new Error('Erro ao extrair texto do PDF'));
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// Função para parsear dados estruturados do texto
function parseContractData(text: string): ContractData {
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

  // Extrair blocos de dados
  const blocks: ContractData['blocks'] = [];
  
  // Dividir o texto em blocos por data de referência
  const blockPattern = /(\d{2}\/\d{2}\/\d{4})/g;
  const datesSet = new Set(text.match(blockPattern) || []);
  const dates = Array.from(datesSet) as string[];

  // Para cada data encontrada, extrair os dados do bloco
  for (let i = 0; i < dates.length; i++) {
    const currentDate = dates[i];
    const nextDate = dates[i + 1];
    
    // Encontrar a seção do bloco
    const blockStart = text.indexOf(currentDate);
    let blockEnd = nextDate ? text.indexOf(nextDate, blockStart + 1) : text.length;
    if (blockEnd === -1) blockEnd = text.length;
    
    const blockText = text.substring(blockStart, blockEnd);

    // Extrair beneficiários
    const beneficiaries: ContractData['blocks'][0]['beneficiaries'] = [];
    
    // Padrão mais flexível para beneficiários
    const beneficiaryPattern = /(\d+)\s+([A-Z\s]+?)\s+(FD\s+\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})\s+([\d.,]+)\s+([\d.,]+)/g;
    
    let match;
    while ((match = beneficiaryPattern.exec(blockText)) !== null) {
      beneficiaries.push({
        contractUnd: match[1],
        name: match[2].trim(),
        rtNcpd: match[3],
        pgFiador: match[4],
        pgMutuario: match[5],
        vrPrevisto: parseFloat(match[6].replace(/\./g, '').replace(',', '.')),
        vrPagoFiador: parseFloat(match[7].replace(/\./g, '').replace(',', '.')),
      });
    }

    if (beneficiaries.length > 0) {
      // Extrair totais do bloco
      const vrPrevistMatch = blockText.match(/VALOR\s+PREVISTO\s*:\s*([\d.,]+)/);
      const vrPagoMatch = blockText.match(/VALOR\s+PAGO\s+FIADOR\s*:\s*([\d.,]+)/);
      const vrIncorporadoMatch = blockText.match(/VALOR\s+INCORPORADO\s*:\s*([\d.,]+)/);
      const vrAmortizadoMatch = blockText.match(/VALOR\s+AMORTIZADO\s*:\s*([\d.,]+)/);
      const vrEstornadoMatch = blockText.match(/VALOR\s+ESTORNADO\s*:\s*([\d.,]+)/);

      blocks.push({
        blockId: blocks.length + 1,
        referenceDate: currentDate,
        beneficiaries,
        totals: {
          vrPrevisto: parseFloat(vrPrevistMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0"),
          vrPagoFiador: parseFloat(vrPagoMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0"),
          vrIncorporado: parseFloat(vrIncorporadoMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0"),
          vrAmortizado: parseFloat(vrAmortizadoMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0"),
          vrEstornado: parseFloat(vrEstornadoMatch?.[1]?.replace(/\./g, '')?.replace(',', '.') || "0"),
        },
      });
    }
  }

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
}

export async function extractPdfData(buffer: Buffer): Promise<ContractData> {
  try {
    const text = await extractTextFromPdf(buffer);
    const data = parseContractData(text);
    
    // Se não encontrou dados, retornar erro
    if (data.blocks.length === 0 && data.contractInfo.contractNumber === "DESCONHECIDO") {
      throw new Error("Não foi possível extrair dados do PDF. Verifique se o formato está correto.");
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao extrair PDF:", error);
    throw new Error(error instanceof Error ? error.message : "Falha ao processar PDF");
  }
}
