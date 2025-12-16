import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export interface FilterState {
  beneficiaryName: string;
  minValue: number | null;
  maxValue: number | null;
  paymentStatus: 'all' | 'paid' | 'unpaid';
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function AdvancedFilters({ onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    beneficiaryName: '',
    minValue: null,
    maxValue: null,
    paymentStatus: 'all',
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      beneficiaryName: '',
      minValue: null,
      maxValue: null,
      paymentStatus: 'all',
    };
    setFilters(defaultFilters);
    onReset();
  };

  const hasActiveFilters = 
    filters.beneficiaryName !== '' || 
    filters.minValue !== null || 
    filters.maxValue !== null || 
    filters.paymentStatus !== 'all';

  return (
    <div className="mb-6">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="mb-4"
      >
        {isOpen ? '▼' : '▶'} Filtros Avançados {hasActiveFilters && `(${[
          filters.beneficiaryName && '1',
          filters.minValue !== null && '1',
          filters.maxValue !== null && '1',
          filters.paymentStatus !== 'all' && '1'
        ].filter(Boolean).length})`}
      </Button>

      {isOpen && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Nome de Beneficiário */}
            <div>
              <Label htmlFor="beneficiary-name" className="text-sm font-medium mb-2 block">
                Nome do Beneficiário
              </Label>
              <Input
                id="beneficiary-name"
                placeholder="Digite o nome..."
                value={filters.beneficiaryName}
                onChange={(e) => handleFilterChange({ beneficiaryName: e.target.value })}
                className="text-sm"
              />
            </div>

            {/* Filtro por Valor Mínimo */}
            <div>
              <Label htmlFor="min-value" className="text-sm font-medium mb-2 block">
                Valor Mínimo (R$)
              </Label>
              <Input
                id="min-value"
                type="number"
                placeholder="0,00"
                value={filters.minValue ?? ''}
                onChange={(e) => handleFilterChange({ 
                  minValue: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="text-sm"
              />
            </div>

            {/* Filtro por Valor Máximo */}
            <div>
              <Label htmlFor="max-value" className="text-sm font-medium mb-2 block">
                Valor Máximo (R$)
              </Label>
              <Input
                id="max-value"
                type="number"
                placeholder="9.999,99"
                value={filters.maxValue ?? ''}
                onChange={(e) => handleFilterChange({ 
                  maxValue: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="text-sm"
              />
            </div>

            {/* Filtro por Status de Pagamento */}
            <div>
              <Label htmlFor="payment-status" className="text-sm font-medium mb-2 block">
                Status de Pagamento
              </Label>
              <select
                id="payment-status"
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange({ 
                  paymentStatus: e.target.value as 'all' | 'paid' | 'unpaid'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="paid">Pagos</option>
                <option value="unpaid">Não Pagos</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 mt-4">
            {hasActiveFilters && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
