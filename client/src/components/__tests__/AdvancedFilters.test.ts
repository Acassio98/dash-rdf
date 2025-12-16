import { describe, it, expect } from 'vitest';

// Teste de lógica de filtros
describe('Advanced Filters Logic', () => {
  const mockBeneficiaries = [
    {
      contractUnd: '123',
      name: 'JOÃO SILVA',
      rtNcpd: 'FD 2501',
      pgFiador: '15/04/2025',
      pgMutuario: '15/04/2025',
      vrPrevisto: 500,
      vrPagoFiador: 500,
    },
    {
      contractUnd: '124',
      name: 'MARIA SANTOS',
      rtNcpd: 'FD 2502',
      pgFiador: '15/04/2025',
      pgMutuario: '00/00/0000',
      vrPrevisto: 1000,
      vrPagoFiador: 1000,
    },
    {
      contractUnd: '125',
      name: 'PEDRO OLIVEIRA',
      rtNcpd: 'FD 2503',
      pgFiador: '15/04/2025',
      pgMutuario: '20/04/2025',
      vrPrevisto: 250,
      vrPagoFiador: 250,
    },
  ];

  it('should filter by beneficiary name', () => {
    const filtered = mockBeneficiaries.filter(b =>
      b.name.toLowerCase().includes('joão')
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('JOÃO SILVA');
  });

  it('should filter by minimum value', () => {
    const minValue = 500;
    const filtered = mockBeneficiaries.filter(b => b.vrPrevisto >= minValue);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(b => b.vrPrevisto >= minValue)).toBe(true);
  });

  it('should filter by maximum value', () => {
    const maxValue = 500;
    const filtered = mockBeneficiaries.filter(b => b.vrPrevisto <= maxValue);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(b => b.vrPrevisto <= maxValue)).toBe(true);
  });

  it('should filter by payment status - paid', () => {
    const filtered = mockBeneficiaries.filter(b => b.pgMutuario !== '00/00/0000');
    expect(filtered).toHaveLength(2);
    expect(filtered.every(b => b.pgMutuario !== '00/00/0000')).toBe(true);
  });

  it('should filter by payment status - unpaid', () => {
    const filtered = mockBeneficiaries.filter(b => b.pgMutuario === '00/00/0000');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('MARIA SANTOS');
  });

  it('should apply multiple filters together', () => {
    const filters = {
      beneficiaryName: 'silva',
      minValue: 400,
      maxValue: 600,
      paymentStatus: 'paid' as const,
    };

    const filtered = mockBeneficiaries.filter(b => {
      if (filters.beneficiaryName && !b.name.toLowerCase().includes(filters.beneficiaryName)) {
        return false;
      }
      if (filters.minValue !== null && b.vrPrevisto < filters.minValue) {
        return false;
      }
      if (filters.maxValue !== null && b.vrPrevisto > filters.maxValue) {
        return false;
      }
      if (filters.paymentStatus === 'paid' && b.pgMutuario === '00/00/0000') {
        return false;
      }
      return true;
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('JOÃO SILVA');
  });

  it('should return all items when no filters are applied', () => {
    const filters = {
      beneficiaryName: '',
      minValue: null,
      maxValue: null,
      paymentStatus: 'all' as const,
    };

    const filtered = mockBeneficiaries.filter(b => {
      if (filters.beneficiaryName && !b.name.toLowerCase().includes(filters.beneficiaryName)) {
        return false;
      }
      if (filters.minValue !== null && b.vrPrevisto < filters.minValue) {
        return false;
      }
      if (filters.maxValue !== null && b.vrPrevisto > filters.maxValue) {
        return false;
      }
      if (filters.paymentStatus === 'paid' && b.pgMutuario === '00/00/0000') {
        return false;
      }
      if (filters.paymentStatus === 'unpaid' && b.pgMutuario !== '00/00/0000') {
        return false;
      }
      return true;
    });

    expect(filtered).toHaveLength(3);
  });
});
