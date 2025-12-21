# DASH RDF - Dashboard de Leitura de Relatório Caixa

Um dashboard moderno e profissional para leitura, análise e visualização de dados de contratos e relatórios de caixa.

## 📋 Sobre o Projeto

**DASH RDF** é um dashboard desenvolvido para facilitar a leitura e análise de relatórios de caixa em formato PDF. O projeto foi desenvolvido por **Acassio Silva** com ajuda da plataforma **Manus**.

### Funcionalidades Principais

✅ **Upload de PDF** - Carregue arquivos PDF do mesmo modelo para extração automática de dados
✅ **Visualização em Tabela** - Tabela interativa com ordenação por coluna
✅ **Visualização em Gráfico** - Gráficos de barras e linhas para análise de tendências
✅ **Filtros Avançados** - Filtro por nome de beneficiário, faixa de valor e status de pagamento
✅ **Busca por Competência** - Pesquise períodos por data (dd/mm/yyyy)
✅ **Análise Individual** - Página dedicada para análise detalhada de cada beneficiário
✅ **Resumo Consolidado** - Cálculos consolidados com saldo devedor, amortizado e estatísticas
✅ **Exportação de Dados** - Exporte dados em CSV ou gráficos em PNG
✅ **Design Responsivo** - Interface otimizada para desktop, tablet e mobile

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Framework JavaScript moderno
- **TypeScript** - Tipagem estática para maior segurança
- **TailwindCSS 4** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI reutilizáveis
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast

### Backend
- **Express.js** - Framework web
- **pdf2json** - Processamento de PDF
- **Multer** - Upload de arquivos
- **tRPC** - RPC type-safe
- **Drizzle ORM** - ORM para banco de dados

### Testes
- **Vitest** - Framework de testes unitários
- **html2canvas** - Captura de gráficos para exportação

## 📊 Dados Suportados

O dashboard processa PDFs com a seguinte estrutura:
- **Informações do Contrato** - Número, nome, emitente
- **Períodos (Competências)** - Datas de referência
- **Beneficiários** - Nome, valores previstos e pagos
- **Totalizadores** - Somas por período

### Exemplo de Dados
- **9 períodos** (15/04/2025 a 17/11/2025)
- **41 beneficiários únicos**
- **Valores consolidados** calculados automaticamente
- **Suporte para múltiplos PDFs**

## 🎨 Design

- **Tema**: Corporativo profissional
- **Paleta de Cores**: Azul profundo (#1e40af) com acentos verde e vermelho
- **Tipografia**: Poppins para títulos, Inter para corpo
- **Modo**: Light theme como padrão
- **Responsividade**: Mobile-first design

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/DASH-RDF.git
cd DASH-RDF

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

O dashboard estará disponível em `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_APP_TITLE=DASH RDF
VITE_APP_LOGO=/logo.png
```

## 📖 Como Usar

1. **Carregar PDF**: Clique em "Selecionar PDF" e escolha um arquivo do mesmo modelo
2. **Selecionar Período**: Use o seletor ou a busca por competência (dd/mm/yyyy)
3. **Filtrar Dados**: Use os filtros avançados para buscar beneficiários específicos
4. **Visualizar**: Alterne entre tabela e gráfico para diferentes perspectivas
5. **Exportar**: Exporte os dados em CSV ou gráficos em PNG
6. **Analisar**: Clique em um beneficiário para ver análise detalhada

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

## 📈 Métricas Calculadas

- **Valor Total Previsto** - Soma de todos os valores previstos
- **Valor Total Pago** - Soma de todos os pagamentos realizados
- **Valor Amortizado** - Soma de valores amortizados
- **Saldo Devedor** - Diferença entre previsto e pago
- **Saldo Líquido** - Diferença entre previsto e amortizado
- **Taxa de Pagamento** - Percentual de valores pagos
- **Taxa de Amortização** - Percentual de valores amortizados

## 🔐 Segurança

- Validação de entrada em todos os campos
- Sanitização de dados do PDF
- Proteção contra XSS
- CORS configurado adequadamente

## 📝 Licença

Este projeto foi desenvolvido por **Acassio Silva** com ajuda da plataforma **Manus**.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Fazer pull requests

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do GitHub.

---

**Desenvolvido com ❤️ por Acassio Silva**
**Com ajuda de Manus - Plataforma de Desenvolvimento IA**
