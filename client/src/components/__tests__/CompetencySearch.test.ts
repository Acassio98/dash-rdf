import { describe, it, expect } from 'vitest';

describe('Competency Search Logic', () => {
  const availableDates = [
    '15/04/2025',
    '15/05/2025',
    '16/06/2025',
    '15/07/2025',
    '15/08/2025',
    '16/09/2025',
    '25/09/2025',
    '15/10/2025',
    '17/11/2025',
  ];

  it('should find date by formatted input', () => {
    const input = '15/08/2025';
    const index = availableDates.indexOf(input);
    expect(index).toBe(4);
  });

  it('should handle different date formats', () => {
    const formatted = '15082025';
    const day = formatted.substring(0, 2);
    const month = formatted.substring(2, 4);
    const year = formatted.substring(4, 8);
    const searchDate = `${day}/${month}/${year}`;

    const index = availableDates.indexOf(searchDate);
    expect(index).toBe(4);
    expect(searchDate).toBe('15/08/2025');
  });

  it('should return -1 for non-existent date', () => {
    const searchDate = '31/12/2025';
    const index = availableDates.indexOf(searchDate);
    expect(index).toBe(-1);
  });

  it('should handle all available dates', () => {
    for (let i = 0; i < availableDates.length; i++) {
      const date = availableDates[i];
      const index = availableDates.indexOf(date);
      expect(index).toBe(i);
    }
  });
});

describe('Final Summary Calculations', () => {
  const mockData = {
    blocks: [
      {
        blockId: 1,
        referenceDate: '15/04/2025',
        totals: {
          vrPrevisto: 243.14,
          vrPagoFiador: 243.14,
          vrIncorporado: 243.14,
          vrAmortizado: 0.0,
          vrEstornado: 0.0,
        },
      },
      {
        blockId: 2,
        referenceDate: '15/05/2025',
        totals: {
          vrPrevisto: 898.96,
          vrPagoFiador: 898.96,
          vrIncorporado: 898.96,
          vrAmortizado: 0.0,
          vrEstornado: 0.0,
        },
      },
      {
        blockId: 3,
        referenceDate: '16/06/2025',
        totals: {
          vrPrevisto: 1456.01,
          vrPagoFiador: 1456.01,
          vrIncorporado: 1456.01,
          vrAmortizado: 100.0,
          vrEstornado: 0.0,
        },
      },
    ],
  };

  it('should calculate total previsto correctly', () => {
    let totalPrevisto = 0;
    for (const block of mockData.blocks) {
      totalPrevisto += block.totals.vrPrevisto;
    }
    expect(totalPrevisto).toBe(2598.11);
  });

  it('should calculate total pago correctly', () => {
    let totalPago = 0;
    for (const block of mockData.blocks) {
      totalPago += block.totals.vrPagoFiador;
    }
    expect(totalPago).toBe(2598.11);
  });

  it('should calculate total amortizado correctly', () => {
    let totalAmortizado = 0;
    for (const block of mockData.blocks) {
      totalAmortizado += block.totals.vrAmortizado;
    }
    expect(totalAmortizado).toBe(100.0);
  });

  it('should calculate saldo devedor correctly', () => {
    let totalPrevisto = 0;
    let totalPago = 0;
    for (const block of mockData.blocks) {
      totalPrevisto += block.totals.vrPrevisto;
      totalPago += block.totals.vrPagoFiador;
    }
    const saldoDevedor = totalPrevisto - totalPago;
    expect(saldoDevedor).toBe(0);
  });

  it('should calculate saldo liquido correctly', () => {
    let totalPrevisto = 0;
    let totalAmortizado = 0;
    for (const block of mockData.blocks) {
      totalPrevisto += block.totals.vrPrevisto;
      totalAmortizado += block.totals.vrAmortizado;
    }
    const saldoLiquido = totalPrevisto - totalAmortizado;
    expect(saldoLiquido).toBe(2498.11);
  });

  it('should calculate payment percentage correctly', () => {
    let totalPrevisto = 0;
    let totalPago = 0;
    for (const block of mockData.blocks) {
      totalPrevisto += block.totals.vrPrevisto;
      totalPago += block.totals.vrPagoFiador;
    }
    const percentualPago = totalPrevisto > 0 ? ((totalPago / totalPrevisto) * 100).toFixed(2) : '0.00';
    expect(percentualPago).toBe('100.00');
  });

  it('should calculate amortization percentage correctly', () => {
    let totalPrevisto = 0;
    let totalAmortizado = 0;
    for (const block of mockData.blocks) {
      totalPrevisto += block.totals.vrPrevisto;
      totalAmortizado += block.totals.vrAmortizado;
    }
    const percentualAmortizado = totalPrevisto > 0 ? ((totalAmortizado / totalPrevisto) * 100).toFixed(2) : '0.00';
    expect(percentualAmortizado).toBe('3.85');
  });
});
