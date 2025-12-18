import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface CompetencySearchProps {
  availableDates: string[];
  onSelect: (index: number) => void;
}

export function CompetencySearch({ availableDates, onSelect }: CompetencySearchProps) {
  const [competency, setCompetency] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    // Formatar a entrada para o padrão dd/mm/yyyy
    const formatted = competency.replace(/\D/g, '');
    
    if (formatted.length === 8) {
      const day = formatted.substring(0, 2);
      const month = formatted.substring(2, 4);
      const year = formatted.substring(4, 8);
      const searchDate = `${day}/${month}/${year}`;

      // Procurar a data nos blocos disponíveis
      const index = availableDates.indexOf(searchDate);
      
      if (index !== -1) {
        onSelect(index);
        setCompetency('');
        setIsOpen(false);
      } else {
        alert(`Competência ${searchDate} não encontrada nos dados.`);
      }
    } else {
      alert('Por favor, digite uma data válida no formato dd/mm/yyyy');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full mb-2"
      >
        <Search className="w-4 h-4 mr-2" />
        {isOpen ? '▼' : '▶'} Pesquisar por Competência
      </Button>

      {isOpen && (
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 mb-4">
          <Label htmlFor="competency" className="text-sm font-medium mb-2 block">
            Digite a competência (dd/mm/yyyy)
          </Label>
          <div className="flex gap-2">
            <Input
              id="competency"
              placeholder="Ex: 15/08/2025"
              value={competency}
              onChange={(e) => setCompetency(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Datas disponíveis: {availableDates.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
